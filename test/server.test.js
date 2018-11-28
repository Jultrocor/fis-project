var server = require("../server");
var chai = require("chai");
var chaiHttp = require("chai-http");
var sinon = require("sinon");
var expect = chai.expect;

chai.use(chaiHttp);

describe("Contacts API", () => {
  it("hello test", done => {
    var x = 3;
    var y = 5;

    var res = x + y;

    expect(res).to.equal(8);

    done();
  });

  before(done => {
    var contacts = [
      { name: "julio", phone: 1234 },
      { name: "alberto", phone: 1234 }
    ];

    var dbFindStub = sinon.stub(server.db, "find");
    dbFindStub.yields(null, contacts);

    done();
  });

  describe("GET /", () => {
    it("should return HTML", done => {
      chai
        .request(server.app)
        .get("/")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;

          done();
        });
    });
  });

  describe("GET /contacts", () => {
    it("should return all contacts in JSON", done => {
      chai
        .request(server.app)
        .get("/api/v1/contacts")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.lengthOf(2);

          done();
        });
    });
  });

  describe("POST /contacts", () => {
    it("should create a new contact", done => {
      var contact = { name: "pablo", phone: 1234 };
      var dbMock = sinon.mock(server.db);
      dbMock.expects("insert").withArgs(contact);

      chai
        .request(server.app)
        .post("/api/v1/contacts")
        .send(contact)
        .end((err, res) => {
          expect(res).to.have.status(201);
          dbMock.verify();

          done();
        });
    });
  });
});
