const yup = require('yup');

async function validateUserPassword(password) {
    const schema = yup.object().shape({
        password: yup
            .string()
            .required('A senha é obrigatória')
            .min(8, 'A senha deve ter no mínimo 8 caracteres')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial'
            ),
    });

    try {
        await schema.validate({ password });
        return { valid: true };
        
    } catch (error) {
        return {
            valid: false,
            error: 'Erro na validação de senha: ' + error.message,
            suggestion: 'Certifique-se de que a senha tenha pelo menos 8 caracteres, inclua uma letra maiúscula, uma letra minúscula, um número e um caractere especial como @$!%*?&',
        };
    }
}

module.exports = validatePassword;