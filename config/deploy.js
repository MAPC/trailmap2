module.exports = function(deployTarget) {  
  return {
    pagefront: {
      app: 'trailmap',
      key: process.env.PAGEFRONT_KEY
    }
  };
};
