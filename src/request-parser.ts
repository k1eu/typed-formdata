import { TypedFormData } from "./typed-formdata.js";

async function parseFormDataRequest<T extends Record<string, string | File>>(
  request: Request
): Promise<TypedFormData<T>> {
  const formData = await request.formData();
  return new TypedFormData<T>(formData);
}

export { parseFormDataRequest };
