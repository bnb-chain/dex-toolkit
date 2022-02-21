const formatAddress = (address: string, sliceNum = 5) => {
  return address
    ? `${address.slice(0, sliceNum)}...${address.slice(address.length - sliceNum)}`
    : '';
};

export default formatAddress;
