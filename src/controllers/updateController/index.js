const authenticateRole = require('../../auth/middlewares/autenticateRole'); // Corrija o caminho se necessário
const updateUserRole = require('../../shared/utils/updateRole');

async function updateUserController(data) {

    if (!data.userAdmEmail || !data.newRole || !data.userEmail) {
        return {
            type: 'error',
            message: 'userAdmEmail, userEmail e newRole são obrigatórios',
        };
    }

    try {
        const isADM = await authenticateRole(data.userAdmEmail);
        if (isADM) {
            const updateUser = await updateUserRole(data.userEmail, data.newRole);

            if (updateUser.type === 'success') {
                return {
                    type: 'success',
                    message: 'Update de função do usuário bem-sucedido.',
                    data: updateUser,
                };
            } else {
                return {
                    type: 'error',
                    message: 'Não foi possível atualizar a função do usuário. ' + updateUser.message,
                };
            }

        } else {
            return {
                type: 'error',
                message: 'Usuário não possui role de ADM.',
                data: data.admEmail
            };
        }
        
    } catch (error) {
        console.error("Update de função do usuário deu erro: ", error);
        return {
            type: 'error',
            message: 'Erro interno ao atualizar a função do usuário.',
        };
    }
}

module.exports = { updateUserController };