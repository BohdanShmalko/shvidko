class JstParser {
  constructor(jst, settings = {}) {
    this.jst = jst;
    let { params, conditions, loops } = settings;
    !conditions ? (this.conditions = []) : (this.conditions = conditions);
    !params ? (this.params = []) : (this.params = params);
    !loops ? (this.loops = []) : (this.loops = loops);
  }
  parseLoops() {
    if (this.loops.length) {
      let js = '';
      let parts = this.jst.split('-<f-');
      let i = 0;
      parts.forEach((part, indexF) => {
        if (part.indexOf('-f>-') + 1) {
          let [loop, content] = part.split('-f>-');
          const oneLoop = this.loops[i];
          i++;
          oneLoop.forEach((loopParams, index) => {
            let tmp = '' + loop;
            loopParams.forEach((param, pIndex) => {
              let re = new RegExp('\\$F' + pIndex, 'g');
              tmp = tmp.replace(re, param);
            });
            js += tmp;
          });

          js += content;
        } else js += part;
      });
      this.jst = js;
    }
    return this.jst;
  }

  parseConditions = () => {
    if (this.conditions.length) {
      let js = '';
      const parts = this.jst.split('-<?-');
      let i = 0;
      parts.forEach((part, index) => {
        if (part.indexOf('-?>-') + 1) {
          let [cond, content] = part.split('-?>-');
          const params = this.conditions[i];
          i++;
          if (params.status) {
            params.params.forEach((param, index) => {
              let re = new RegExp('\\$E' + index, 'g');
              cond = cond.replace(re, param);
            });
            js += cond;
          }
          js += content;
        } else js += part;
      });
      this.jst = js;
    }
    return this.jst;
  };

  parseVariables() {
    if (this.params.length) {
      let js = this.jst;
      this.params.forEach((param, index) => {
        let re = new RegExp('\\$' + index, 'g');
        js = js.replace(re, param);
      });
      this.jst = js;
    }
    return this.jst;
  }

  parse() {
    this.parseLoops();
    this.parseConditions();
    this.parseVariables();
    return this.jst;
  }
}

module.exports = (jst, params) => new JstParser(jst, params);
