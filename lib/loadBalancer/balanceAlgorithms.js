let counter = 0;
const roundRobin = (req, serverPool, healthyPool, failCount = 0) => {
  counter++;
  const index = counter % serverPool.length;
  if (index === 0) counter = 0;
  if (healthyPool[index]) return index;
  failCount++;
  if (failCount > healthyPool.length) return -1;
  return roundRobin(req, serverPool, healthyPool, failCount);
};

module.exports = { roundRobin };
