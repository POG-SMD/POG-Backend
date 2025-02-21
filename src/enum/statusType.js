
const statusType = {
  PENDENTE: 1,
  EM_RESERVA: 2,
  RECUSADO: 3,
  FINALIZADO: 4,
  CANCELADO: 5,
}

const getStatusLabel = (status) => {
  const texts = {
    [currencyType.PENDENTE]: 'PENDENTE',
    [currencyType.EM_RESERVA]: 'EM RESERVA',
    [currencyType.RECUSADO]: 'RECUSADO',
    [currencyType.FINALIZADO]: 'FINALIZADO',
    [currencyType.CANCELADO]: 'CANCELADO',
  }

  return texts[status]
}

module.exports = {
  statusType,
  getStatusLabel
}