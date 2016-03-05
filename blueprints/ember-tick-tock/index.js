/*jshint node:true*/
/*jshint esnext:true*/
module.exports = {
  normalizeEntityName() {},

  afterInstall(options) {
    return this.addBowerPackageToProject('moment', '~2.11.1');
  }
};
