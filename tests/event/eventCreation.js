describe("event creation", function() {
    describe("event types", function() {
        it("creates public events");
        it("creates unlisted events");
        it("creates private events");
    });
});

describe("event non creation", function() {
    it("doesn't create without authentication");
    describe("incomplete/invalid data", function() {
        it("doesn't create without name");
        it("doesn't create without visibility");
        it("doesn't create without ingress");
        it("doesn't create with short name");
    });
    describe("invalid settings", function() {
        //Tests with invalid setting combinations (ingress and visibility)
    });
});
describe("event retrival", function() {
    it("retrieves public event (without auth)");
    it("fails to retrieve unlisted event (without auth)");
    it("retrieves unlisted event (with auth)");
    it("fails to retrieve private event (without auth)");
    it("fails to retrieve private event (with auth but no privileges)");
});