const convertOrderStatus = (status: string) => {
  status = status.toUpperCase();
  switch (status) {
    case 'PARTIALFILL':
      return 'Partial';
    case 'IOCNOFILL':
      return 'Expired';
    case 'IOCEXPIRE':
      return 'Expired';
    case 'EXPIRED':
      return 'Expired';
    case 'CANCELED':
      return 'Canceled';
    case 'FULLYFILL':
      return 'Filled';
    case 'FAILED':
      return 'Failed';
    case 'FAILEDBLOCKING':
      return 'Failed';
    case 'FAILEDMATCHING':
      return 'Failed';
    default:
      return 'Filled';
  }
};

export default convertOrderStatus;
