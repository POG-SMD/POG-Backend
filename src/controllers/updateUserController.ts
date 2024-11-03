require('../auth/middlewares/autenticateRole');
require('../../shared/utils/updateRole');

async function updateUserControllerByData(data) {

    if (!data.userEmail || !data.newRole) {
        return {
            type: 'error',
            message: 'userEmail e newRole são obrigatórios',
        };
    }

    try {
        const isADM = await authenticateRole(data.userEmail);
        if (!isADM) {
            const updateUser = await updateUserRoleByEmail(data.userEmail, data.newRole);

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