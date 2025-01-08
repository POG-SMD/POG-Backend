const validatePassword = require('./index');

describe('validatePassword', () => {
    it('deveria retornar um valor valido para essa senha.', async () => {
        const result = await validatePassword('StrongP@ssw0rd');
        expect(result.valid).toBe(true);
    });

    it('severia retornar um valor falso e explicar o porquê da senha ser fraca.', async () => {
        const result = await validatePassword('weak');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Erro na validação de senha:');
        expect(result.suggestion).toContain('Certifique-se de que a senha tenha pelo menos 8 caracteres');
    });

    it('deveria retornar um valor falso por conta de não possuir senha.', async () => {
        const result = await validatePassword('');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Erro na validação de senha:');
    });

    it('deveria retornar um valor falso por não possuir uma senha com caracteres especiais.', async () => {
        const result = await validatePassword('WeakPassword123');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Erro na validação de senha:');
    });
});
