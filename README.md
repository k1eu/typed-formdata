# typed-formdata

`typed-formdata` is a utility library for working with FormData in Typescript.

In a nutshell, Typed FormData allows you to:

- Work with FormData with strongly typed fields
- Helpful for both Frontend and Backend work with FormData
- Integrate it with Full stack typescript frameworks like Remix, Next.js, Nest.js
- It is a drop-in replacement for FormData
- It is built on top of the native FormData interface
- _Parse the formData body according to schema (WIP)_

## Installation

```sh
npm install @k1eu/typed-formdata
```

```sh
yarn add @k1eu/typed-formdata
```

```sh
pnpm add @k1eu/typed-formdata
```

```sh
bun add @k1eu/typed-formdata
```

## Overview

Package can help you both on Frontend and Backend side of the application.
It provides a `TypedFormData` class and parser functions for Request and FormData. Of course it is advised to have a validation layer in your backend until we have a schema validator implemented in the library.

Request handler:

```ts
import { TypedFormData } from "@k1eu/typed-formdata";

type IncomingData = {
  resourceId: string;
  file: File;
};

export const handler = async (req: Request) => {
  const formData = parseFormDataRequest<IncomingData>(req);
  const resourceId: string = formData.get("resourceId");
  const file: File = formData.get("file");
  const age: string = formData.get("age"); // Type Error! Age doesn't exist in IncomingData

  saveFile(file, resourceId);

  return new Response(
    `Hello your file ${file.name} is saved for the resource ${resourceId}`
  );
};
```

Frontend form:

```ts
import { TypedFormData } from "@k1eu/typed-formdata";

type MyFormData = {
  login: string;
  password: string;
};

function MyPage() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new TypedFormData<MyFormData>(e.currentTarget);
        const login: string = formData.get("login");
        const password: string = formData.get("password");
        loginAndSubmit(login, password);
      }}
    >
      <input type="login" name="login" />
      <input type="password" name="password" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

Remix action:

```tsx
import { TypedFormData } from "@k1eu/typed-formdata";

type FormFields = {
  login: string;
  password: string;
};

export async function action({ request }: ActionArgs) {
  const formData = parseFormDataRequest<FormFields>(request);
  const login: string = formData.get("login");
  const password: string = formData.get("password");
  const file = formData.get("file"); // Type Error!
  loginAndSubmit(login, password);
  return redirect("/success");
}

export default function MyPage() {
  return (
    <main>
      <Form method="post">
        <input type="login" name="login" />
        <input type="password" name="password" />
        <button type="submit">Submit</button>
      </Form>
    </main>
  );
}
```

Other Parser functions:

```ts
// parseFormData
import { parseFormData } from "@k1eu/typed-formdata";

type FormFields = {
  resourceId: string;
  file: File;
};

const formData = new FormData(document.querySelector("form"));
const typedFormData = await parseFormData<FormFields>(formData);

// same as
// const typedFormData = new TypedFormData(document.querySelector("form") as HTMLFormElement);
```

## License

See [LICENSE](https://github.com/k1eu/typed-formdata/blob/main/LICENSE)
