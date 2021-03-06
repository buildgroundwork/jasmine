describe("ObjectContaining", function() {

  it("matches any object actual to an empty object", function() {
    var containing = new jasmineUnderTest.ObjectContaining({});

    expect(containing.asymmetricMatch({foo: 1})).toBe(true);
  });

  it("does not match when the actual is not an object", function() {
    var containing = new jasmineUnderTest.ObjectContaining({});

    [1, true, undefined, "a string"].forEach(function(actual) {
      expect(containing.asymmetricMatch(actual)).toBe(false);
    });
  });

  it("does not match an empty object actual", function() {
    var containing = new jasmineUnderTest.ObjectContaining("foo");

    expect(function() {
      containing.asymmetricMatch({})
    }).toThrowError(/not 'foo'/)
  });

  it("matches when the key/value pair is present in the actual", function() {
    var containing = new jasmineUnderTest.ObjectContaining({foo: "fooVal"});

    expect(containing.asymmetricMatch({foo: "fooVal", bar: "barVal"})).toBe(true);
  });

  it("does not match when the key/value pair is not present in the actual", function() {
    var containing = new jasmineUnderTest.ObjectContaining({foo: "fooVal"});

    expect(containing.asymmetricMatch({bar: "barVal", quux: "quuxVal"})).toBe(false);
  });

  it("does not match when the key is present but the value is different in the actual", function() {
    var containing = new jasmineUnderTest.ObjectContaining({foo: "other"});

    expect(containing.asymmetricMatch({foo: "fooVal", bar: "barVal"})).toBe(false);
  });

  it("jasmineToString's itself", function() {
    var containing = new jasmineUnderTest.ObjectContaining({});

    expect(containing.jasmineToString()).toMatch("<jasmine.objectContaining");
  });

  it("matches recursively", function() {
    var containing = new jasmineUnderTest.ObjectContaining({one: new jasmineUnderTest.ObjectContaining({two: {}})});

    expect(containing.asymmetricMatch({one: {two: {}}})).toBe(true);
  });

  it("matches when key is present with undefined value", function() {
    var containing = new jasmineUnderTest.ObjectContaining({ one: undefined });

    expect(containing.asymmetricMatch({ one: undefined })).toBe(true);
  });

  it("does not match when key with undefined value is not present", function() {
    var containing = new jasmineUnderTest.ObjectContaining({ one: undefined });

    expect(containing.asymmetricMatch({})).toBe(false);
  });

  it("matches defined properties", function(){
    var containing = new jasmineUnderTest.ObjectContaining({ foo: "fooVal" });

    var definedPropertyObject = {};
    Object.defineProperty(definedPropertyObject, "foo", {
      get: function() { return "fooVal" }
    });
    expect(containing.asymmetricMatch(definedPropertyObject)).toBe(true);
  });

  it("matches prototype properties", function(){
    var containing = new jasmineUnderTest.ObjectContaining({ foo: "fooVal" });

    var prototypeObject = {foo: "fooVal"};
    var obj;

    if (Object.create) {
      obj = Object.create(prototypeObject);
    } else {
      function Foo() {}
      Foo.prototype = prototypeObject;
      Foo.prototype.constructor = Foo;
      obj = new Foo();
    }

    expect(containing.asymmetricMatch(obj)).toBe(true);
  });

  it("uses custom equality testers", function() {
    var tester = function(a, b) {
      // All "foo*" strings match each other.
      if (typeof a == "string" && typeof b == "string" &&
          a.substr(0, 3) == "foo" && b.substr(0, 3) == "foo") {
        return true;
      }
    };
    var containing = new jasmineUnderTest.ObjectContaining({foo: "fooVal"});

    expect(containing.asymmetricMatch({foo: "fooBar"}, [tester])).toBe(true);
  });

  describe("valuesForDiff_", function() {
    describe("when other is not an object", function() {
      it("sets self to jasmineToString()", function () {
        var containing = new jasmineUnderTest.ObjectContaining({}),
          result = containing.valuesForDiff_('a');

        expect(result).toEqual({
          self: '<jasmine.objectContaining(Object({  }))>',
          other: 'a'
        });
      });
    });

    describe("when other is an object", function() {
      it("includes keys that are present in both other and sample", function() {
        var sample = {a: 1, b: 2},
          other = {a: 3, b: 4},
          containing = new jasmineUnderTest.ObjectContaining(sample),
          result = containing.valuesForDiff_(other);

        expect(result.self).not.toBeInstanceOf(jasmineUnderTest.ObjectContaining);
        expect(result).toEqual({
          self: sample,
          other: other
        });
      });

      it("includes keys that are present in only sample", function() {
        var sample = {a: 1, b: 2},
          other = {a: 3},
          containing = new jasmineUnderTest.ObjectContaining(sample),
          result = containing.valuesForDiff_(other);

        expect(result.self).not.toBeInstanceOf(jasmineUnderTest.ObjectContaining);
        expect(containing.valuesForDiff_(other)).toEqual({
          self: sample,
          other: {
            a: 3,
            b: undefined
          }
        });
      });

      it("omits keys that are present only in other", function() {
        var sample = {a: 1, b: 2},
          other = {a: 3, b: 4, c: 5},
          containing = new jasmineUnderTest.ObjectContaining(sample),
          result = containing.valuesForDiff_(other);

        expect(result.self).not.toBeInstanceOf(jasmineUnderTest.ObjectContaining);
        expect(result).toEqual({
          self: sample,
          other: {
            a: 3,
            b: 4
          }
        });
      });
    });
  });
});
