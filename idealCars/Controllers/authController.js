const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// @desc    Procesar solicitud de recuperación de contraseña
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar que se proporcionó un correo
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Por favor proporcione un correo electrónico' 
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'No existe un usuario con ese correo electrónico' 
      });
    }

    // Obtener token de restablecimiento
    const resetToken = user.getResetPasswordToken();

    // Guardar el token generado en la base de datos
    await user.save({ validateBeforeSave: false });

    // Crear URL de restablecimiento
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    // Crear mensaje
    const message = `Has solicitado restablecer tu contraseña. Por favor realiza una petición PUT a: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Restablecimiento de contraseña',
        message
      });

      res.status(200).json({ success: true, data: 'Correo enviado' });
    } catch (err) {
      console.error('Error al enviar email:', err);
      
      // Si hay error al enviar email, eliminar el token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ 
        success: false, 
        error: 'No se pudo enviar el correo electrónico' 
      });
    }
  } catch (err) {
    console.error('Error en forgot password:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error del servidor' 
    });
  }
};

// @desc    Restablecer contraseña
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Obtener token del parámetro y crear hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    // Buscar usuario con el token y que no haya expirado
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Token inválido o expirado'
      });
    }

    // Validar la nueva contraseña
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false, 
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Eliminar campos de recuperación
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Guardar los cambios
    await user.save();

    res.status(200).json({
      success: true,
      data: 'Contraseña actualizada correctamente'
    });
  } catch (err) {
    console.error('Error en reset password:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error del servidor' 
    });
  }
};

// Ejemplo de archivo .env necesario:
// MONGO_URI=mongodb://localhost:27017/auth_db
// PORT=5000
// SMTP_HOST=smtp.mailtrap.io
// SMTP_PORT=2525
// SMTP_EMAIL=tu-usuario
// SMTP_PASSWORD=tu-contraseña
// FROM_NAME=Administrador
// FROM_EMAIL=noreply@tudominio.com