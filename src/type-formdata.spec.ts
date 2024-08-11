import { describe, it, expect, beforeEach, expectTypeOf } from "vitest";
import { TypedFormData } from "./typed-formdata.js";

describe("TypedFormData", () => {
  type TestForm = {
    name: string;
    age: string;
    avatar: File;
  };

  let typedFormData: TypedFormData<TestForm>;

  beforeEach(() => {
    typedFormData = new TypedFormData<TestForm>();
  });

  describe("native FormData behavior", () => {
    it(".set() should set and .get() should get values", () => {
      typedFormData.set("name", "John Doe");
      typedFormData.set("age", "30");

      expect(typedFormData.get("name")).toBe("John Doe");
      expect(typedFormData.get("age")).toBe("30");
    });

    it(".append()should append values", () => {
      typedFormData.append("name", "John");
      typedFormData.append("name", "Doe");

      expect(typedFormData.getAll("name")).toEqual(["John", "Doe"]);
    });

    it(".get() should return null for non-existent key", () => {
      expect(typedFormData.get("name")).toBeNull();
    });

    it(".get() should return the first value for a key with multiple values", () => {
      typedFormData.append("name", "John");
      typedFormData.append("name", "Doe");
      expect(typedFormData.get("name")).toBe("John");
    });

    it(".get() should return correct value for the key with one value", () => {
      typedFormData.set("name", "John");
      expect(typedFormData.get("name")).toBe("John");
    });

    it(".has()should check if key exists", () => {
      typedFormData.set("name", "John");

      expect(typedFormData.has("name")).toBe(true);
      expect(typedFormData.has("age")).toBe(false);
    });

    it(".delete() should delete key", () => {
      typedFormData.set("name", "John");
      typedFormData.delete("name");

      expect(typedFormData.has("name")).toBe(false);
    });

    it(".entries() should return entries", () => {
      typedFormData.set("name", "John");
      typedFormData.set("age", "30");

      const entries = Array.from(typedFormData.entries());
      expect(entries).toEqual([
        ["name", "John"],
        ["age", "30"],
      ]);
    });

    it(".keys() should return only keys", () => {
      typedFormData.set("name", "John");
      typedFormData.set("age", "30");

      const keys = Array.from(typedFormData.keys());
      expect(keys).toEqual(["name", "age"]);
    });

    it(".values() should return only values", () => {
      typedFormData.set("name", "John");
      typedFormData.set("age", "30");

      const values = Array.from(typedFormData.values());
      expect(values).toEqual(["John", "30"]);
    });
  });

  describe("TypedFormData constructor", () => {
    it("should create an empty TypedFormData when no argument is provided", () => {
      const typedFormData = new TypedFormData<TestForm>();
      expect(Array.from(typedFormData.entries())).toEqual([]);
    });

    it("should initialize from HTMLFormElement", () => {
      const form = document.createElement("form");
      const input = document.createElement("input");
      input.name = "name";
      input.value = "John Doe";
      form.appendChild(input);

      const typedFormData = new TypedFormData<TestForm>(form);
      expect(typedFormData.get("name")).toBe("John Doe");
    });

    it("should initialize from FormData", () => {
      const formData = new FormData();
      formData.append("name", "John Doe");
      formData.append("age", "30");

      const typedFormData = new TypedFormData<TestForm>(formData);
      expect(typedFormData.get("name")).toBe("John Doe");
      expect(typedFormData.get("age")).toBe("30");
    });
  });

  describe("extendes TypedFormData methods", () => {
    it(".getObject() should return object representation", () => {
      typedFormData.set("name", "John");
      typedFormData.set("age", "30");

      expect(typedFormData.getObject()).toEqual({ name: "John", age: "30" });
    });
    it(".getObject() should return last value if many keys are set", () => {
      typedFormData.set("name", "John");
      typedFormData.set("age", "30");
      typedFormData.append("name", "John Doe");

      expect(typedFormData.getObject()).toEqual({
        name: "John Doe",
        age: "30",
      });
    });
    it(".getFormData() should return FormData", () => {
      typedFormData.set("name", "John");
      typedFormData.set("age", "30");

      expect(typedFormData.getFormData()).toBeInstanceOf(FormData);
    });
    it(".typedEntries() should return entries", () => {
      typedFormData.set("name", "John");
      typedFormData.set("age", "30");

      const entries = Array.from(typedFormData.typedEntries());
      expect(entries).toEqual([
        ["name", "John"],
        ["age", "30"],
      ]);
    });
  });

  describe("types of TypedFormData methods", () => {
    describe("get()", () => {
      it(".get() of string key should return string", () => {
        typedFormData.set("name", "John");
        expectTypeOf(typedFormData.get("name")).toEqualTypeOf<string | null>();
      });
      it(".get() of file key should return File", () => {
        typedFormData.set("avatar", new File([], "avatar.png"));
        expectTypeOf(typedFormData.get("avatar")).toEqualTypeOf<File | null>();
      });
      it(".get() first argument should be keys of TestForm", () => {
        typedFormData.set("name", "John");
        expectTypeOf(typedFormData.get)
          .parameter(0)
          .toEqualTypeOf<keyof TestForm>();
        expectTypeOf(typedFormData.get)
          .parameter(0)
          .toEqualTypeOf<"name" | "age" | "avatar">();
      });
      it(".get() first argument shout not be other keys", () => {
        typedFormData.set("name", "John");
        expectTypeOf(typedFormData.get)
          .parameter(0)
          .not.toEqualTypeOf<"other">();
      });
    });
    describe(".set()", () => {
      it(".set() first argument should be keys of TestForm", () => {
        typedFormData.set("name", "John");
        expectTypeOf(typedFormData.set)
          .parameter(0)
          .toEqualTypeOf<keyof TestForm>();
        expectTypeOf(typedFormData.set)
          .parameter(0)
          .toEqualTypeOf<"name" | "age" | "avatar">();
      });
      it(".set() first argument shout not be other keys", () => {
        typedFormData.set("name", "John");
        expectTypeOf(typedFormData.set)
          .parameter(0)
          .not.toEqualTypeOf<"other">();
      });
      it.todo(
        ".set() second argument should be value for the key of TestForm",
        () => {
          // This can be impproved to handle situation when value is File
          typedFormData.set("name", "John");
        }
      );
    });

    describe(".append()", () => {
      it(".append() first argument should be keys of TestForm", () => {
        typedFormData.append("name", "John");
        expectTypeOf(typedFormData.append)
          .parameter(0)
          .toEqualTypeOf<keyof TestForm>();
        expectTypeOf(typedFormData.append)
          .parameter(0)
          .toEqualTypeOf<"name" | "age" | "avatar">();
      });
      it.todo(
        ".append() second argument should be value for the key of TestForm",
        () => {
          // This can be impproved to handle situation when value is File
          typedFormData.append("name", "John");
        }
      );
    });

    describe(".has()", () => {
      it(".has() first argument should be keys of TestForm", () => {
        typedFormData.set("name", "John");
        expectTypeOf(typedFormData.has)
          .parameter(0)
          .toEqualTypeOf<keyof TestForm>();
        expectTypeOf(typedFormData.has)
          .parameter(0)
          .toEqualTypeOf<"name" | "age" | "avatar">();
      });
    });

    describe(".delete()", () => {
      it(".delete() first argument should be keys of TestForm", () => {
        typedFormData.set("name", "John");
        expectTypeOf(typedFormData.delete)
          .parameter(0)
          .toEqualTypeOf<keyof TestForm>();
        expectTypeOf(typedFormData.delete)
          .parameter(0)
          .toEqualTypeOf<"name" | "age" | "avatar">();
      });
    });

    describe(".typedEntries()", () => {
      it(".typedEntries() should return typed entries", () => {
        typedFormData.set("name", "John");
        typedFormData.set("age", "30");

        const entries = Array.from(typedFormData.typedEntries());
        expectTypeOf(entries).toEqualTypeOf<
          [keyof TestForm, TestForm[keyof TestForm]][]
        >();
      });
    });
  });
});
