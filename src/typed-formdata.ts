class TypedFormData<T extends Record<string, string | File>>
  implements FormData
{
  private formData: FormData = new FormData();

  constructor(initElement?: HTMLFormElement | FormData) {
    if (!initElement) {
      return;
    }
    if (initElement instanceof FormData) {
      this.formData = initElement;
      return;
    }

    this.formData = new FormData(initElement);
  }

  public get<K extends keyof T>(key: Extract<K, string>): T[K] {
    return this.formData.get(key) as T[K];
  }

  public getAll(key: string): FormDataEntryValue[] {
    return this.formData.getAll(key);
  }

  /**
   * Executes a provided function once for each key/value pair in the FormData object.
   * @deprecated This method is deprecated and is not advised to be used. Use entries() or for...of loop instead.
   * @param callbackfn A function that is called for each key/value pair in the FormData object.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  public forEach(
    callbackfn: (
      value: FormDataEntryValue,
      key: string,
      parent: FormData
    ) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thisArg?: unknown
  ): void {
    this.formData.forEach(callbackfn, thisArg);
  }

  public getFormData(): FormData {
    return this.formData;
  }

  public getObject(): T {
    return Object.fromEntries(this.entries()) as T;
  }

  public entries(): IterableIterator<[string, FormDataEntryValue]> {
    return this.formData.entries();
  }

  public typedEntries(): IterableIterator<[keyof T, T[keyof T]]> {
    return this.entries() as IterableIterator<[keyof T, T[keyof T]]>;
  }

  public keys(): IterableIterator<string> {
    return this.formData.keys();
  }

  public values(): IterableIterator<FormDataEntryValue> {
    return this.formData.values();
  }

  public set(key: keyof T, value: T[keyof T]): void;
  public set(key: string, value: string): void;
  public set(key: string, value: Blob): void;
  public set(key: string, value: string | Blob, filename?: string): void {
    if (typeof value === "string") {
      this.formData.set(key, value);
    } else {
      this.formData.set(key, value, filename);
    }
  }

  public append(key: keyof T, value: T[keyof T]): void;
  public append(key: string, value: string): void;
  public append(key: string, value: Blob): void;
  public append(key: string, value: string | Blob, filename?: string): void {
    if (typeof value === "string") {
      this.formData.append(key, value);
    } else {
      this.formData.append(key, value, filename);
    }
  }

  public has(key: string): boolean {
    return this.formData.has(key);
  }

  public delete(key: string): void {
    this.formData.delete(key);
  }

  public *[Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]> {
    yield* this.entries();
  }
}

export { TypedFormData };
