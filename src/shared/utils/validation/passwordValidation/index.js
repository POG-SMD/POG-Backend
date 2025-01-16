const yup = require('yup');

async function validatePassword(password) {
    const schema = yup.object().shape({
        password: yup
            .string()
            .required('A senha é obrigatória.')
            .matches(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula.')
            .matches(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula.')
            .matches(/[0-9]/, 'A senha deve conter ao menos um número.')
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                'A senha deve conter ao menos um caractere especial (!@#$%^&*(),.?":{}|<>).'
            )
            .min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    });

    try {
        await schema.validate({ password });
        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            error: 'Erro na validação de senha: ' + error.errors[0],
            suggestion:
                'Certifique-se de que a senha tenha pelo menos 8 caracteres, inclua uma letra maiúscula, uma letra minúscula, um número e um caractere especial como !@#$%^&*(),.?":{}|<>.',
        };
    }
}

module.exports = validatePassword;
