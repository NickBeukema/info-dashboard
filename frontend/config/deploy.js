/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: { environment: deployTarget },

    'revision-data': {
      type: 'git-commit'
    },

    'ssh-index': {
      privateKeyFile: '/Users/beukema/.ssh/id_rsa',
      allowOverwrite: true
    },

    rsync: {
      delete: false
    }

  };

  if (deployTarget === 'development') {
  }

  if (deployTarget === 'staging') {
  }

  if (deployTarget === 'production') {
    let deployDest = '/home/ubuntu/frontend';

    ENV['ssh-index'].remoteDir = deployDest;
    ENV['ssh-index'].host = '162.243.50.161';
    ENV['ssh-index'].username = 'ubuntu';

    ENV['rsync'].dest = deployDest;
    ENV['rsync'].username = 'ubuntu';
    ENV['rsync'].host = 'ubuntu@162.243.50.161';
  }

  return ENV;
};
