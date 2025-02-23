
const statusType = {
  PENDENTE: 1,
  EM_RESERVA: 2,
  RECUSADO: 3,
  FINALIZADO: 4,
  CANCELADO: 5,
}

const getStatusLabel = (status) => {
  const texts = {
    [statusType.PENDENTE]: 'PENDENTE',
    [statusType.EM_RESERVA]: 'EM RESERVA',
    [statusType.RECUSADO]: 'RECUSADO',
    [statusType.FINALIZADO]: 'FINALIZADO',
    [statusType.CANCELADO]: 'CANCELADO',
  }

  return texts[status]
}

module.exports = {
  statusType,
  getStatusLabel
}