import * as chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

export function get_chai() {
  return {
    expect: chai.expect,
    request: chai.request,
  };
}

export default get_chai;