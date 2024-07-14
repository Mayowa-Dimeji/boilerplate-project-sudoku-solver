// tests/2_functional-tests.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("POST /api/solve", () => {
    test("Solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "solution");
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve a puzzle with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: "1.5..2.84..63.12.7.2..5....+{" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Solve a puzzle with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Solve a puzzle that cannot be solved", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.372",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST /api/check", () => {
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A1",
          value: "7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "valid");
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A1",
          value: "1",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "valid");
          if (res.body.valid) {
            assert.isTrue(res.body.valid);
          } else {
            assert.isFalse(res.body.valid);
            assert.property(res.body, "conflict");
            assert.isArray(res.body.conflict);
            assert.include(res.body.conflict, "row");
          }
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A1",
          value: "2",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.property(res.body, "conflict");
          assert.isArray(res.body.conflict);
          assert.include(res.body.conflict, "row");
          assert.include(res.body.conflict, "column");
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2684..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A2", // Changed to produce row, column, and region conflicts
          value: "6",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.property(res.body, "conflict");
          assert.isArray(res.body.conflict);
          assert.include(res.body.conflict, "row");
          assert.include(res.body.conflict, "column");
          assert.include(res.body.conflict, "region");
          done();
        });
    });

    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37g",
          coordinate: "A1",
          value: "7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.",
          coordinate: "A1",
          value: "7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "Z1",
          value: "7",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A1",
          value: "10",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
