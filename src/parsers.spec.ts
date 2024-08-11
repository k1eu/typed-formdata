import { describe, expect, expectTypeOf, it } from "vitest";
import { parseFormData, parseFormDataRequest } from "./parsers.js";
import { TypedFormData } from "./typed-formdata.js";

type TestForm = {
  foo: string;
  baz: string;
  file: File;
};

describe("parseFormDataRequest", () => {
  it("should parse into TypedFormData from Request", async () => {
    const formData = new FormData();
    formData.append("foo", "bar");
    formData.append("baz", "qux");
    formData.append("file", new File([], "file.txt"));

    const request = new Request("http://localhost", {
      method: "POST",
      body: formData,
    });

    const parsed = await parseFormDataRequest<TestForm>(request);

    expect(parsed).toBeInstanceOf(TypedFormData);
    expect(parsed.get("foo")).toBe("bar");
    expect(parsed.get("baz")).toBe("qux");
    expectTypeOf(parsed.get("file")).toEqualTypeOf<File | null>();
  });
});

describe("parseFormData", () => {
  it("should parse into TypedFormData from FormData", () => {
    const formData = new FormData();
    formData.append("foo", "bar");
    formData.append("baz", "qux");
    formData.append("file", new File([], "file.txt"));

    const parsed = parseFormData<TestForm>(formData);

    expect(parsed).toBeInstanceOf(TypedFormData);
    expect(parsed.get("foo")).toBe("bar");
    expect(parsed.get("baz")).toBe("qux");
    expectTypeOf(parsed.get("file")).toEqualTypeOf<File | null>();
  });
  it("should parse into TypedFormData from Browser FormData", () => {
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.name = "foo";
    input.value = "bar";
    form.appendChild(input);

    const formData = new FormData(form);
    const parsed = parseFormData<TestForm>(formData);

    expect(parsed).toBeInstanceOf(TypedFormData);
    expect(parsed.get("foo")).toBe("bar");
    expectTypeOf(parsed.get("baz")).toEqualTypeOf<string | null>();
    expectTypeOf(parsed.get("file")).toEqualTypeOf<File | null>();
  });
});

