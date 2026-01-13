
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model LoyaltyPointSetting
 * 
 */
export type LoyaltyPointSetting = $Result.DefaultSelection<Prisma.$LoyaltyPointSettingPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model LoyaltyPoint
 * 
 */
export type LoyaltyPoint = $Result.DefaultSelection<Prisma.$LoyaltyPointPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model ConversionFactor
 * 
 */
export type ConversionFactor = $Result.DefaultSelection<Prisma.$ConversionFactorPayload>
/**
 * Model Brand
 * 
 */
export type Brand = $Result.DefaultSelection<Prisma.$BrandPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Supplier
 * 
 */
export type Supplier = $Result.DefaultSelection<Prisma.$SupplierPayload>
/**
 * Model UnitOfMeasure
 * 
 */
export type UnitOfMeasure = $Result.DefaultSelection<Prisma.$UnitOfMeasurePayload>
/**
 * Model Reminder
 * 
 */
export type Reminder = $Result.DefaultSelection<Prisma.$ReminderPayload>
/**
 * Model SalesUser
 * 
 */
export type SalesUser = $Result.DefaultSelection<Prisma.$SalesUserPayload>
/**
 * Model UserPermission
 * 
 */
export type UserPermission = $Result.DefaultSelection<Prisma.$UserPermissionPayload>
/**
 * Model BusinessProfile
 * 
 */
export type BusinessProfile = $Result.DefaultSelection<Prisma.$BusinessProfilePayload>
/**
 * Model BackupSchedule
 * 
 */
export type BackupSchedule = $Result.DefaultSelection<Prisma.$BackupSchedulePayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loyaltyPointSetting`: Exposes CRUD operations for the **LoyaltyPointSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoyaltyPointSettings
    * const loyaltyPointSettings = await prisma.loyaltyPointSetting.findMany()
    * ```
    */
  get loyaltyPointSetting(): Prisma.LoyaltyPointSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loyaltyPoint`: Exposes CRUD operations for the **LoyaltyPoint** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoyaltyPoints
    * const loyaltyPoints = await prisma.loyaltyPoint.findMany()
    * ```
    */
  get loyaltyPoint(): Prisma.LoyaltyPointDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversionFactor`: Exposes CRUD operations for the **ConversionFactor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConversionFactors
    * const conversionFactors = await prisma.conversionFactor.findMany()
    * ```
    */
  get conversionFactor(): Prisma.ConversionFactorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.brand`: Exposes CRUD operations for the **Brand** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Brands
    * const brands = await prisma.brand.findMany()
    * ```
    */
  get brand(): Prisma.BrandDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplier`: Exposes CRUD operations for the **Supplier** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Suppliers
    * const suppliers = await prisma.supplier.findMany()
    * ```
    */
  get supplier(): Prisma.SupplierDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.unitOfMeasure`: Exposes CRUD operations for the **UnitOfMeasure** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UnitOfMeasures
    * const unitOfMeasures = await prisma.unitOfMeasure.findMany()
    * ```
    */
  get unitOfMeasure(): Prisma.UnitOfMeasureDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reminder`: Exposes CRUD operations for the **Reminder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reminders
    * const reminders = await prisma.reminder.findMany()
    * ```
    */
  get reminder(): Prisma.ReminderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.salesUser`: Exposes CRUD operations for the **SalesUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SalesUsers
    * const salesUsers = await prisma.salesUser.findMany()
    * ```
    */
  get salesUser(): Prisma.SalesUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userPermission`: Exposes CRUD operations for the **UserPermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPermissions
    * const userPermissions = await prisma.userPermission.findMany()
    * ```
    */
  get userPermission(): Prisma.UserPermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.businessProfile`: Exposes CRUD operations for the **BusinessProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BusinessProfiles
    * const businessProfiles = await prisma.businessProfile.findMany()
    * ```
    */
  get businessProfile(): Prisma.BusinessProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.backupSchedule`: Exposes CRUD operations for the **BackupSchedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BackupSchedules
    * const backupSchedules = await prisma.backupSchedule.findMany()
    * ```
    */
  get backupSchedule(): Prisma.BackupScheduleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.1.0
   * Query Engine version: ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    Transaction: 'Transaction',
    LoyaltyPointSetting: 'LoyaltyPointSetting',
    Customer: 'Customer',
    LoyaltyPoint: 'LoyaltyPoint',
    Product: 'Product',
    ConversionFactor: 'ConversionFactor',
    Brand: 'Brand',
    Category: 'Category',
    Supplier: 'Supplier',
    UnitOfMeasure: 'UnitOfMeasure',
    Reminder: 'Reminder',
    SalesUser: 'SalesUser',
    UserPermission: 'UserPermission',
    BusinessProfile: 'BusinessProfile',
    BackupSchedule: 'BackupSchedule',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "account" | "transaction" | "loyaltyPointSetting" | "customer" | "loyaltyPoint" | "product" | "conversionFactor" | "brand" | "category" | "supplier" | "unitOfMeasure" | "reminder" | "salesUser" | "userPermission" | "businessProfile" | "backupSchedule" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      LoyaltyPointSetting: {
        payload: Prisma.$LoyaltyPointSettingPayload<ExtArgs>
        fields: Prisma.LoyaltyPointSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoyaltyPointSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoyaltyPointSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointSettingPayload>
          }
          findFirst: {
            args: Prisma.LoyaltyPointSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoyaltyPointSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointSettingPayload>
          }
          findMany: {
            args: Prisma.LoyaltyPointSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointSettingPayload>[]
          }
          create: {
            args: Prisma.LoyaltyPointSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointSettingPayload>
          }
          createMany: {
            args: Prisma.LoyaltyPointSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LoyaltyPointSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointSettingPayload>
          }
          update: {
            args: Prisma.LoyaltyPointSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointSettingPayload>
          }
          deleteMany: {
            args: Prisma.LoyaltyPointSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoyaltyPointSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LoyaltyPointSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointSettingPayload>
          }
          aggregate: {
            args: Prisma.LoyaltyPointSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoyaltyPointSetting>
          }
          groupBy: {
            args: Prisma.LoyaltyPointSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoyaltyPointSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoyaltyPointSettingCountArgs<ExtArgs>
            result: $Utils.Optional<LoyaltyPointSettingCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      LoyaltyPoint: {
        payload: Prisma.$LoyaltyPointPayload<ExtArgs>
        fields: Prisma.LoyaltyPointFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoyaltyPointFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoyaltyPointFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointPayload>
          }
          findFirst: {
            args: Prisma.LoyaltyPointFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoyaltyPointFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointPayload>
          }
          findMany: {
            args: Prisma.LoyaltyPointFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointPayload>[]
          }
          create: {
            args: Prisma.LoyaltyPointCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointPayload>
          }
          createMany: {
            args: Prisma.LoyaltyPointCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LoyaltyPointDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointPayload>
          }
          update: {
            args: Prisma.LoyaltyPointUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointPayload>
          }
          deleteMany: {
            args: Prisma.LoyaltyPointDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoyaltyPointUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LoyaltyPointUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPointPayload>
          }
          aggregate: {
            args: Prisma.LoyaltyPointAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoyaltyPoint>
          }
          groupBy: {
            args: Prisma.LoyaltyPointGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoyaltyPointGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoyaltyPointCountArgs<ExtArgs>
            result: $Utils.Optional<LoyaltyPointCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      ConversionFactor: {
        payload: Prisma.$ConversionFactorPayload<ExtArgs>
        fields: Prisma.ConversionFactorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversionFactorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversionFactorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversionFactorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversionFactorPayload>
          }
          findFirst: {
            args: Prisma.ConversionFactorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversionFactorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversionFactorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversionFactorPayload>
          }
          findMany: {
            args: Prisma.ConversionFactorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversionFactorPayload>[]
          }
          create: {
            args: Prisma.ConversionFactorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversionFactorPayload>
          }
          createMany: {
            args: Prisma.ConversionFactorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ConversionFactorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversionFactorPayload>
          }
          update: {
            args: Prisma.ConversionFactorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversionFactorPayload>
          }
          deleteMany: {
            args: Prisma.ConversionFactorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversionFactorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConversionFactorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversionFactorPayload>
          }
          aggregate: {
            args: Prisma.ConversionFactorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversionFactor>
          }
          groupBy: {
            args: Prisma.ConversionFactorGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversionFactorGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversionFactorCountArgs<ExtArgs>
            result: $Utils.Optional<ConversionFactorCountAggregateOutputType> | number
          }
        }
      }
      Brand: {
        payload: Prisma.$BrandPayload<ExtArgs>
        fields: Prisma.BrandFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BrandFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BrandFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          findFirst: {
            args: Prisma.BrandFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BrandFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          findMany: {
            args: Prisma.BrandFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>[]
          }
          create: {
            args: Prisma.BrandCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          createMany: {
            args: Prisma.BrandCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BrandDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          update: {
            args: Prisma.BrandUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          deleteMany: {
            args: Prisma.BrandDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BrandUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BrandUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BrandPayload>
          }
          aggregate: {
            args: Prisma.BrandAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBrand>
          }
          groupBy: {
            args: Prisma.BrandGroupByArgs<ExtArgs>
            result: $Utils.Optional<BrandGroupByOutputType>[]
          }
          count: {
            args: Prisma.BrandCountArgs<ExtArgs>
            result: $Utils.Optional<BrandCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Supplier: {
        payload: Prisma.$SupplierPayload<ExtArgs>
        fields: Prisma.SupplierFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findFirst: {
            args: Prisma.SupplierFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findMany: {
            args: Prisma.SupplierFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          create: {
            args: Prisma.SupplierCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          createMany: {
            args: Prisma.SupplierCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SupplierDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          update: {
            args: Prisma.SupplierUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          deleteMany: {
            args: Prisma.SupplierDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SupplierUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          aggregate: {
            args: Prisma.SupplierAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplier>
          }
          groupBy: {
            args: Prisma.SupplierGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierCountAggregateOutputType> | number
          }
        }
      }
      UnitOfMeasure: {
        payload: Prisma.$UnitOfMeasurePayload<ExtArgs>
        fields: Prisma.UnitOfMeasureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UnitOfMeasureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitOfMeasurePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UnitOfMeasureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitOfMeasurePayload>
          }
          findFirst: {
            args: Prisma.UnitOfMeasureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitOfMeasurePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UnitOfMeasureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitOfMeasurePayload>
          }
          findMany: {
            args: Prisma.UnitOfMeasureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitOfMeasurePayload>[]
          }
          create: {
            args: Prisma.UnitOfMeasureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitOfMeasurePayload>
          }
          createMany: {
            args: Prisma.UnitOfMeasureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UnitOfMeasureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitOfMeasurePayload>
          }
          update: {
            args: Prisma.UnitOfMeasureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitOfMeasurePayload>
          }
          deleteMany: {
            args: Prisma.UnitOfMeasureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UnitOfMeasureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UnitOfMeasureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitOfMeasurePayload>
          }
          aggregate: {
            args: Prisma.UnitOfMeasureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnitOfMeasure>
          }
          groupBy: {
            args: Prisma.UnitOfMeasureGroupByArgs<ExtArgs>
            result: $Utils.Optional<UnitOfMeasureGroupByOutputType>[]
          }
          count: {
            args: Prisma.UnitOfMeasureCountArgs<ExtArgs>
            result: $Utils.Optional<UnitOfMeasureCountAggregateOutputType> | number
          }
        }
      }
      Reminder: {
        payload: Prisma.$ReminderPayload<ExtArgs>
        fields: Prisma.ReminderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReminderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReminderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          findFirst: {
            args: Prisma.ReminderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReminderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          findMany: {
            args: Prisma.ReminderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>[]
          }
          create: {
            args: Prisma.ReminderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          createMany: {
            args: Prisma.ReminderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ReminderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          update: {
            args: Prisma.ReminderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          deleteMany: {
            args: Prisma.ReminderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReminderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReminderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReminderPayload>
          }
          aggregate: {
            args: Prisma.ReminderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReminder>
          }
          groupBy: {
            args: Prisma.ReminderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReminderGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReminderCountArgs<ExtArgs>
            result: $Utils.Optional<ReminderCountAggregateOutputType> | number
          }
        }
      }
      SalesUser: {
        payload: Prisma.$SalesUserPayload<ExtArgs>
        fields: Prisma.SalesUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SalesUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SalesUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesUserPayload>
          }
          findFirst: {
            args: Prisma.SalesUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SalesUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesUserPayload>
          }
          findMany: {
            args: Prisma.SalesUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesUserPayload>[]
          }
          create: {
            args: Prisma.SalesUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesUserPayload>
          }
          createMany: {
            args: Prisma.SalesUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SalesUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesUserPayload>
          }
          update: {
            args: Prisma.SalesUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesUserPayload>
          }
          deleteMany: {
            args: Prisma.SalesUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SalesUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SalesUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesUserPayload>
          }
          aggregate: {
            args: Prisma.SalesUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSalesUser>
          }
          groupBy: {
            args: Prisma.SalesUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<SalesUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.SalesUserCountArgs<ExtArgs>
            result: $Utils.Optional<SalesUserCountAggregateOutputType> | number
          }
        }
      }
      UserPermission: {
        payload: Prisma.$UserPermissionPayload<ExtArgs>
        fields: Prisma.UserPermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserPermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserPermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          findFirst: {
            args: Prisma.UserPermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserPermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          findMany: {
            args: Prisma.UserPermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          create: {
            args: Prisma.UserPermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          createMany: {
            args: Prisma.UserPermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserPermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          update: {
            args: Prisma.UserPermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          deleteMany: {
            args: Prisma.UserPermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserPermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserPermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          aggregate: {
            args: Prisma.UserPermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserPermission>
          }
          groupBy: {
            args: Prisma.UserPermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserPermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserPermissionCountArgs<ExtArgs>
            result: $Utils.Optional<UserPermissionCountAggregateOutputType> | number
          }
        }
      }
      BusinessProfile: {
        payload: Prisma.$BusinessProfilePayload<ExtArgs>
        fields: Prisma.BusinessProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BusinessProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BusinessProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessProfilePayload>
          }
          findFirst: {
            args: Prisma.BusinessProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BusinessProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessProfilePayload>
          }
          findMany: {
            args: Prisma.BusinessProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessProfilePayload>[]
          }
          create: {
            args: Prisma.BusinessProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessProfilePayload>
          }
          createMany: {
            args: Prisma.BusinessProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BusinessProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessProfilePayload>
          }
          update: {
            args: Prisma.BusinessProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessProfilePayload>
          }
          deleteMany: {
            args: Prisma.BusinessProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BusinessProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BusinessProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessProfilePayload>
          }
          aggregate: {
            args: Prisma.BusinessProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBusinessProfile>
          }
          groupBy: {
            args: Prisma.BusinessProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<BusinessProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.BusinessProfileCountArgs<ExtArgs>
            result: $Utils.Optional<BusinessProfileCountAggregateOutputType> | number
          }
        }
      }
      BackupSchedule: {
        payload: Prisma.$BackupSchedulePayload<ExtArgs>
        fields: Prisma.BackupScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackupScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupSchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackupScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupSchedulePayload>
          }
          findFirst: {
            args: Prisma.BackupScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupSchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackupScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupSchedulePayload>
          }
          findMany: {
            args: Prisma.BackupScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupSchedulePayload>[]
          }
          create: {
            args: Prisma.BackupScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupSchedulePayload>
          }
          createMany: {
            args: Prisma.BackupScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BackupScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupSchedulePayload>
          }
          update: {
            args: Prisma.BackupScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupSchedulePayload>
          }
          deleteMany: {
            args: Prisma.BackupScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackupScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BackupScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupSchedulePayload>
          }
          aggregate: {
            args: Prisma.BackupScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackupSchedule>
          }
          groupBy: {
            args: Prisma.BackupScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackupScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackupScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<BackupScheduleCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    account?: AccountOmit
    transaction?: TransactionOmit
    loyaltyPointSetting?: LoyaltyPointSettingOmit
    customer?: CustomerOmit
    loyaltyPoint?: LoyaltyPointOmit
    product?: ProductOmit
    conversionFactor?: ConversionFactorOmit
    brand?: BrandOmit
    category?: CategoryOmit
    supplier?: SupplierOmit
    unitOfMeasure?: UnitOfMeasureOmit
    reminder?: ReminderOmit
    salesUser?: SalesUserOmit
    userPermission?: UserPermissionOmit
    businessProfile?: BusinessProfileOmit
    backupSchedule?: BackupScheduleOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LoyaltyPointSettingCountOutputType
   */

  export type LoyaltyPointSettingCountOutputType = {
    loyaltyPoints: number
  }

  export type LoyaltyPointSettingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loyaltyPoints?: boolean | LoyaltyPointSettingCountOutputTypeCountLoyaltyPointsArgs
  }

  // Custom InputTypes
  /**
   * LoyaltyPointSettingCountOutputType without action
   */
  export type LoyaltyPointSettingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSettingCountOutputType
     */
    select?: LoyaltyPointSettingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LoyaltyPointSettingCountOutputType without action
   */
  export type LoyaltyPointSettingCountOutputTypeCountLoyaltyPointsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoyaltyPointWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    loyaltyPoints: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loyaltyPoints?: boolean | CustomerCountOutputTypeCountLoyaltyPointsArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountLoyaltyPointsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoyaltyPointWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    accnt_no: number | null
    accnt_type_no: number | null
    balance: number | null
  }

  export type AccountSumAggregateOutputType = {
    accnt_no: number | null
    accnt_type_no: number | null
    balance: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accnt_no: number | null
    accnt_type_no: number | null
    name: string | null
    balance: number | null
    type: string | null
    header: string | null
    bank: string | null
    category: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accnt_no: number | null
    accnt_type_no: number | null
    name: string | null
    balance: number | null
    type: string | null
    header: string | null
    bank: string | null
    category: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accnt_no: number
    accnt_type_no: number
    name: number
    balance: number
    type: number
    header: number
    bank: number
    category: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    accnt_no?: true
    accnt_type_no?: true
    balance?: true
  }

  export type AccountSumAggregateInputType = {
    accnt_no?: true
    accnt_type_no?: true
    balance?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    accnt_no?: true
    accnt_type_no?: true
    name?: true
    balance?: true
    type?: true
    header?: true
    bank?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accnt_no?: true
    accnt_type_no?: true
    name?: true
    balance?: true
    type?: true
    header?: true
    bank?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accnt_no?: true
    accnt_type_no?: true
    name?: true
    balance?: true
    type?: true
    header?: true
    bank?: true
    category?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accnt_no: number
    accnt_type_no: number
    name: string
    balance: number | null
    type: string
    header: string
    bank: string
    category: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accnt_no?: boolean
    accnt_type_no?: boolean
    name?: boolean
    balance?: boolean
    type?: boolean
    header?: boolean
    bank?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["account"]>



  export type AccountSelectScalar = {
    id?: boolean
    accnt_no?: boolean
    accnt_type_no?: boolean
    name?: boolean
    balance?: boolean
    type?: boolean
    header?: boolean
    bank?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accnt_no" | "accnt_type_no" | "name" | "balance" | "type" | "header" | "bank" | "category" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accnt_no: number
      accnt_type_no: number
      name: string
      balance: number | null
      type: string
      header: string
      bank: string
      category: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accnt_no: FieldRef<"Account", 'Int'>
    readonly accnt_type_no: FieldRef<"Account", 'Int'>
    readonly name: FieldRef<"Account", 'String'>
    readonly balance: FieldRef<"Account", 'Float'>
    readonly type: FieldRef<"Account", 'String'>
    readonly header: FieldRef<"Account", 'String'>
    readonly bank: FieldRef<"Account", 'String'>
    readonly category: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    seq: number | null
    debit: number | null
    credit: number | null
    balance: number | null
    dailyClosing: number | null
  }

  export type TransactionSumAggregateOutputType = {
    seq: number | null
    debit: number | null
    credit: number | null
    balance: number | null
    dailyClosing: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    seq: number | null
    ledger: string | null
    transNo: string | null
    code: string | null
    accountNumber: string | null
    date: Date | null
    invoiceNumber: string | null
    particulars: string | null
    debit: number | null
    credit: number | null
    balance: number | null
    checkAccountNumber: string | null
    checkNumber: string | null
    dateMatured: Date | null
    accountName: string | null
    bankName: string | null
    bankBranch: string | null
    user: string | null
    isCoincide: boolean | null
    dailyClosing: number | null
    approval: string | null
    ftToLedger: string | null
    ftToAccount: string | null
    ssma_timestamp: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    seq: number | null
    ledger: string | null
    transNo: string | null
    code: string | null
    accountNumber: string | null
    date: Date | null
    invoiceNumber: string | null
    particulars: string | null
    debit: number | null
    credit: number | null
    balance: number | null
    checkAccountNumber: string | null
    checkNumber: string | null
    dateMatured: Date | null
    accountName: string | null
    bankName: string | null
    bankBranch: string | null
    user: string | null
    isCoincide: boolean | null
    dailyClosing: number | null
    approval: string | null
    ftToLedger: string | null
    ftToAccount: string | null
    ssma_timestamp: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    seq: number
    ledger: number
    transNo: number
    code: number
    accountNumber: number
    date: number
    invoiceNumber: number
    particulars: number
    debit: number
    credit: number
    balance: number
    checkAccountNumber: number
    checkNumber: number
    dateMatured: number
    accountName: number
    bankName: number
    bankBranch: number
    user: number
    isCoincide: number
    dailyClosing: number
    approval: number
    ftToLedger: number
    ftToAccount: number
    ssma_timestamp: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    seq?: true
    debit?: true
    credit?: true
    balance?: true
    dailyClosing?: true
  }

  export type TransactionSumAggregateInputType = {
    seq?: true
    debit?: true
    credit?: true
    balance?: true
    dailyClosing?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    seq?: true
    ledger?: true
    transNo?: true
    code?: true
    accountNumber?: true
    date?: true
    invoiceNumber?: true
    particulars?: true
    debit?: true
    credit?: true
    balance?: true
    checkAccountNumber?: true
    checkNumber?: true
    dateMatured?: true
    accountName?: true
    bankName?: true
    bankBranch?: true
    user?: true
    isCoincide?: true
    dailyClosing?: true
    approval?: true
    ftToLedger?: true
    ftToAccount?: true
    ssma_timestamp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    seq?: true
    ledger?: true
    transNo?: true
    code?: true
    accountNumber?: true
    date?: true
    invoiceNumber?: true
    particulars?: true
    debit?: true
    credit?: true
    balance?: true
    checkAccountNumber?: true
    checkNumber?: true
    dateMatured?: true
    accountName?: true
    bankName?: true
    bankBranch?: true
    user?: true
    isCoincide?: true
    dailyClosing?: true
    approval?: true
    ftToLedger?: true
    ftToAccount?: true
    ssma_timestamp?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    seq?: true
    ledger?: true
    transNo?: true
    code?: true
    accountNumber?: true
    date?: true
    invoiceNumber?: true
    particulars?: true
    debit?: true
    credit?: true
    balance?: true
    checkAccountNumber?: true
    checkNumber?: true
    dateMatured?: true
    accountName?: true
    bankName?: true
    bankBranch?: true
    user?: true
    isCoincide?: true
    dailyClosing?: true
    approval?: true
    ftToLedger?: true
    ftToAccount?: true
    ssma_timestamp?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    seq: number | null
    ledger: string | null
    transNo: string | null
    code: string | null
    accountNumber: string | null
    date: Date | null
    invoiceNumber: string | null
    particulars: string | null
    debit: number | null
    credit: number | null
    balance: number | null
    checkAccountNumber: string | null
    checkNumber: string | null
    dateMatured: Date | null
    accountName: string | null
    bankName: string | null
    bankBranch: string | null
    user: string | null
    isCoincide: boolean | null
    dailyClosing: number | null
    approval: string | null
    ftToLedger: string | null
    ftToAccount: string | null
    ssma_timestamp: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    seq?: boolean
    ledger?: boolean
    transNo?: boolean
    code?: boolean
    accountNumber?: boolean
    date?: boolean
    invoiceNumber?: boolean
    particulars?: boolean
    debit?: boolean
    credit?: boolean
    balance?: boolean
    checkAccountNumber?: boolean
    checkNumber?: boolean
    dateMatured?: boolean
    accountName?: boolean
    bankName?: boolean
    bankBranch?: boolean
    user?: boolean
    isCoincide?: boolean
    dailyClosing?: boolean
    approval?: boolean
    ftToLedger?: boolean
    ftToAccount?: boolean
    ssma_timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["transaction"]>



  export type TransactionSelectScalar = {
    id?: boolean
    seq?: boolean
    ledger?: boolean
    transNo?: boolean
    code?: boolean
    accountNumber?: boolean
    date?: boolean
    invoiceNumber?: boolean
    particulars?: boolean
    debit?: boolean
    credit?: boolean
    balance?: boolean
    checkAccountNumber?: boolean
    checkNumber?: boolean
    dateMatured?: boolean
    accountName?: boolean
    bankName?: boolean
    bankBranch?: boolean
    user?: boolean
    isCoincide?: boolean
    dailyClosing?: boolean
    approval?: boolean
    ftToLedger?: boolean
    ftToAccount?: boolean
    ssma_timestamp?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "seq" | "ledger" | "transNo" | "code" | "accountNumber" | "date" | "invoiceNumber" | "particulars" | "debit" | "credit" | "balance" | "checkAccountNumber" | "checkNumber" | "dateMatured" | "accountName" | "bankName" | "bankBranch" | "user" | "isCoincide" | "dailyClosing" | "approval" | "ftToLedger" | "ftToAccount" | "ssma_timestamp" | "createdAt" | "updatedAt", ExtArgs["result"]["transaction"]>

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      seq: number | null
      ledger: string | null
      transNo: string | null
      code: string | null
      accountNumber: string | null
      date: Date | null
      invoiceNumber: string | null
      particulars: string | null
      debit: number | null
      credit: number | null
      balance: number | null
      checkAccountNumber: string | null
      checkNumber: string | null
      dateMatured: Date | null
      accountName: string | null
      bankName: string | null
      bankBranch: string | null
      user: string | null
      isCoincide: boolean | null
      dailyClosing: number | null
      approval: string | null
      ftToLedger: string | null
      ftToAccount: string | null
      ssma_timestamp: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly seq: FieldRef<"Transaction", 'Int'>
    readonly ledger: FieldRef<"Transaction", 'String'>
    readonly transNo: FieldRef<"Transaction", 'String'>
    readonly code: FieldRef<"Transaction", 'String'>
    readonly accountNumber: FieldRef<"Transaction", 'String'>
    readonly date: FieldRef<"Transaction", 'DateTime'>
    readonly invoiceNumber: FieldRef<"Transaction", 'String'>
    readonly particulars: FieldRef<"Transaction", 'String'>
    readonly debit: FieldRef<"Transaction", 'Float'>
    readonly credit: FieldRef<"Transaction", 'Float'>
    readonly balance: FieldRef<"Transaction", 'Float'>
    readonly checkAccountNumber: FieldRef<"Transaction", 'String'>
    readonly checkNumber: FieldRef<"Transaction", 'String'>
    readonly dateMatured: FieldRef<"Transaction", 'DateTime'>
    readonly accountName: FieldRef<"Transaction", 'String'>
    readonly bankName: FieldRef<"Transaction", 'String'>
    readonly bankBranch: FieldRef<"Transaction", 'String'>
    readonly user: FieldRef<"Transaction", 'String'>
    readonly isCoincide: FieldRef<"Transaction", 'Boolean'>
    readonly dailyClosing: FieldRef<"Transaction", 'Int'>
    readonly approval: FieldRef<"Transaction", 'String'>
    readonly ftToLedger: FieldRef<"Transaction", 'String'>
    readonly ftToAccount: FieldRef<"Transaction", 'String'>
    readonly ssma_timestamp: FieldRef<"Transaction", 'DateTime'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
  }


  /**
   * Model LoyaltyPointSetting
   */

  export type AggregateLoyaltyPointSetting = {
    _count: LoyaltyPointSettingCountAggregateOutputType | null
    _avg: LoyaltyPointSettingAvgAggregateOutputType | null
    _sum: LoyaltyPointSettingSumAggregateOutputType | null
    _min: LoyaltyPointSettingMinAggregateOutputType | null
    _max: LoyaltyPointSettingMaxAggregateOutputType | null
  }

  export type LoyaltyPointSettingAvgAggregateOutputType = {
    amount: number | null
    equivalentPoint: number | null
  }

  export type LoyaltyPointSettingSumAggregateOutputType = {
    amount: number | null
    equivalentPoint: number | null
  }

  export type LoyaltyPointSettingMinAggregateOutputType = {
    id: string | null
    description: string | null
    amount: number | null
    equivalentPoint: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoyaltyPointSettingMaxAggregateOutputType = {
    id: string | null
    description: string | null
    amount: number | null
    equivalentPoint: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoyaltyPointSettingCountAggregateOutputType = {
    id: number
    description: number
    amount: number
    equivalentPoint: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LoyaltyPointSettingAvgAggregateInputType = {
    amount?: true
    equivalentPoint?: true
  }

  export type LoyaltyPointSettingSumAggregateInputType = {
    amount?: true
    equivalentPoint?: true
  }

  export type LoyaltyPointSettingMinAggregateInputType = {
    id?: true
    description?: true
    amount?: true
    equivalentPoint?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoyaltyPointSettingMaxAggregateInputType = {
    id?: true
    description?: true
    amount?: true
    equivalentPoint?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoyaltyPointSettingCountAggregateInputType = {
    id?: true
    description?: true
    amount?: true
    equivalentPoint?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LoyaltyPointSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyPointSetting to aggregate.
     */
    where?: LoyaltyPointSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoyaltyPointSettings to fetch.
     */
    orderBy?: LoyaltyPointSettingOrderByWithRelationInput | LoyaltyPointSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoyaltyPointSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoyaltyPointSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoyaltyPointSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoyaltyPointSettings
    **/
    _count?: true | LoyaltyPointSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoyaltyPointSettingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoyaltyPointSettingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoyaltyPointSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoyaltyPointSettingMaxAggregateInputType
  }

  export type GetLoyaltyPointSettingAggregateType<T extends LoyaltyPointSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateLoyaltyPointSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoyaltyPointSetting[P]>
      : GetScalarType<T[P], AggregateLoyaltyPointSetting[P]>
  }




  export type LoyaltyPointSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoyaltyPointSettingWhereInput
    orderBy?: LoyaltyPointSettingOrderByWithAggregationInput | LoyaltyPointSettingOrderByWithAggregationInput[]
    by: LoyaltyPointSettingScalarFieldEnum[] | LoyaltyPointSettingScalarFieldEnum
    having?: LoyaltyPointSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoyaltyPointSettingCountAggregateInputType | true
    _avg?: LoyaltyPointSettingAvgAggregateInputType
    _sum?: LoyaltyPointSettingSumAggregateInputType
    _min?: LoyaltyPointSettingMinAggregateInputType
    _max?: LoyaltyPointSettingMaxAggregateInputType
  }

  export type LoyaltyPointSettingGroupByOutputType = {
    id: string
    description: string
    amount: number
    equivalentPoint: number
    createdAt: Date
    updatedAt: Date
    _count: LoyaltyPointSettingCountAggregateOutputType | null
    _avg: LoyaltyPointSettingAvgAggregateOutputType | null
    _sum: LoyaltyPointSettingSumAggregateOutputType | null
    _min: LoyaltyPointSettingMinAggregateOutputType | null
    _max: LoyaltyPointSettingMaxAggregateOutputType | null
  }

  type GetLoyaltyPointSettingGroupByPayload<T extends LoyaltyPointSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoyaltyPointSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoyaltyPointSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoyaltyPointSettingGroupByOutputType[P]>
            : GetScalarType<T[P], LoyaltyPointSettingGroupByOutputType[P]>
        }
      >
    >


  export type LoyaltyPointSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    description?: boolean
    amount?: boolean
    equivalentPoint?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    loyaltyPoints?: boolean | LoyaltyPointSetting$loyaltyPointsArgs<ExtArgs>
    _count?: boolean | LoyaltyPointSettingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loyaltyPointSetting"]>



  export type LoyaltyPointSettingSelectScalar = {
    id?: boolean
    description?: boolean
    amount?: boolean
    equivalentPoint?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LoyaltyPointSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "description" | "amount" | "equivalentPoint" | "createdAt" | "updatedAt", ExtArgs["result"]["loyaltyPointSetting"]>
  export type LoyaltyPointSettingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loyaltyPoints?: boolean | LoyaltyPointSetting$loyaltyPointsArgs<ExtArgs>
    _count?: boolean | LoyaltyPointSettingCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $LoyaltyPointSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoyaltyPointSetting"
    objects: {
      loyaltyPoints: Prisma.$LoyaltyPointPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      description: string
      amount: number
      equivalentPoint: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["loyaltyPointSetting"]>
    composites: {}
  }

  type LoyaltyPointSettingGetPayload<S extends boolean | null | undefined | LoyaltyPointSettingDefaultArgs> = $Result.GetResult<Prisma.$LoyaltyPointSettingPayload, S>

  type LoyaltyPointSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoyaltyPointSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoyaltyPointSettingCountAggregateInputType | true
    }

  export interface LoyaltyPointSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoyaltyPointSetting'], meta: { name: 'LoyaltyPointSetting' } }
    /**
     * Find zero or one LoyaltyPointSetting that matches the filter.
     * @param {LoyaltyPointSettingFindUniqueArgs} args - Arguments to find a LoyaltyPointSetting
     * @example
     * // Get one LoyaltyPointSetting
     * const loyaltyPointSetting = await prisma.loyaltyPointSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoyaltyPointSettingFindUniqueArgs>(args: SelectSubset<T, LoyaltyPointSettingFindUniqueArgs<ExtArgs>>): Prisma__LoyaltyPointSettingClient<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoyaltyPointSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoyaltyPointSettingFindUniqueOrThrowArgs} args - Arguments to find a LoyaltyPointSetting
     * @example
     * // Get one LoyaltyPointSetting
     * const loyaltyPointSetting = await prisma.loyaltyPointSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoyaltyPointSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, LoyaltyPointSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoyaltyPointSettingClient<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoyaltyPointSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointSettingFindFirstArgs} args - Arguments to find a LoyaltyPointSetting
     * @example
     * // Get one LoyaltyPointSetting
     * const loyaltyPointSetting = await prisma.loyaltyPointSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoyaltyPointSettingFindFirstArgs>(args?: SelectSubset<T, LoyaltyPointSettingFindFirstArgs<ExtArgs>>): Prisma__LoyaltyPointSettingClient<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoyaltyPointSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointSettingFindFirstOrThrowArgs} args - Arguments to find a LoyaltyPointSetting
     * @example
     * // Get one LoyaltyPointSetting
     * const loyaltyPointSetting = await prisma.loyaltyPointSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoyaltyPointSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, LoyaltyPointSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoyaltyPointSettingClient<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoyaltyPointSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoyaltyPointSettings
     * const loyaltyPointSettings = await prisma.loyaltyPointSetting.findMany()
     * 
     * // Get first 10 LoyaltyPointSettings
     * const loyaltyPointSettings = await prisma.loyaltyPointSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loyaltyPointSettingWithIdOnly = await prisma.loyaltyPointSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoyaltyPointSettingFindManyArgs>(args?: SelectSubset<T, LoyaltyPointSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoyaltyPointSetting.
     * @param {LoyaltyPointSettingCreateArgs} args - Arguments to create a LoyaltyPointSetting.
     * @example
     * // Create one LoyaltyPointSetting
     * const LoyaltyPointSetting = await prisma.loyaltyPointSetting.create({
     *   data: {
     *     // ... data to create a LoyaltyPointSetting
     *   }
     * })
     * 
     */
    create<T extends LoyaltyPointSettingCreateArgs>(args: SelectSubset<T, LoyaltyPointSettingCreateArgs<ExtArgs>>): Prisma__LoyaltyPointSettingClient<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoyaltyPointSettings.
     * @param {LoyaltyPointSettingCreateManyArgs} args - Arguments to create many LoyaltyPointSettings.
     * @example
     * // Create many LoyaltyPointSettings
     * const loyaltyPointSetting = await prisma.loyaltyPointSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoyaltyPointSettingCreateManyArgs>(args?: SelectSubset<T, LoyaltyPointSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LoyaltyPointSetting.
     * @param {LoyaltyPointSettingDeleteArgs} args - Arguments to delete one LoyaltyPointSetting.
     * @example
     * // Delete one LoyaltyPointSetting
     * const LoyaltyPointSetting = await prisma.loyaltyPointSetting.delete({
     *   where: {
     *     // ... filter to delete one LoyaltyPointSetting
     *   }
     * })
     * 
     */
    delete<T extends LoyaltyPointSettingDeleteArgs>(args: SelectSubset<T, LoyaltyPointSettingDeleteArgs<ExtArgs>>): Prisma__LoyaltyPointSettingClient<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoyaltyPointSetting.
     * @param {LoyaltyPointSettingUpdateArgs} args - Arguments to update one LoyaltyPointSetting.
     * @example
     * // Update one LoyaltyPointSetting
     * const loyaltyPointSetting = await prisma.loyaltyPointSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoyaltyPointSettingUpdateArgs>(args: SelectSubset<T, LoyaltyPointSettingUpdateArgs<ExtArgs>>): Prisma__LoyaltyPointSettingClient<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoyaltyPointSettings.
     * @param {LoyaltyPointSettingDeleteManyArgs} args - Arguments to filter LoyaltyPointSettings to delete.
     * @example
     * // Delete a few LoyaltyPointSettings
     * const { count } = await prisma.loyaltyPointSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoyaltyPointSettingDeleteManyArgs>(args?: SelectSubset<T, LoyaltyPointSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoyaltyPointSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoyaltyPointSettings
     * const loyaltyPointSetting = await prisma.loyaltyPointSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoyaltyPointSettingUpdateManyArgs>(args: SelectSubset<T, LoyaltyPointSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LoyaltyPointSetting.
     * @param {LoyaltyPointSettingUpsertArgs} args - Arguments to update or create a LoyaltyPointSetting.
     * @example
     * // Update or create a LoyaltyPointSetting
     * const loyaltyPointSetting = await prisma.loyaltyPointSetting.upsert({
     *   create: {
     *     // ... data to create a LoyaltyPointSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoyaltyPointSetting we want to update
     *   }
     * })
     */
    upsert<T extends LoyaltyPointSettingUpsertArgs>(args: SelectSubset<T, LoyaltyPointSettingUpsertArgs<ExtArgs>>): Prisma__LoyaltyPointSettingClient<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoyaltyPointSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointSettingCountArgs} args - Arguments to filter LoyaltyPointSettings to count.
     * @example
     * // Count the number of LoyaltyPointSettings
     * const count = await prisma.loyaltyPointSetting.count({
     *   where: {
     *     // ... the filter for the LoyaltyPointSettings we want to count
     *   }
     * })
    **/
    count<T extends LoyaltyPointSettingCountArgs>(
      args?: Subset<T, LoyaltyPointSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoyaltyPointSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoyaltyPointSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoyaltyPointSettingAggregateArgs>(args: Subset<T, LoyaltyPointSettingAggregateArgs>): Prisma.PrismaPromise<GetLoyaltyPointSettingAggregateType<T>>

    /**
     * Group by LoyaltyPointSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoyaltyPointSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoyaltyPointSettingGroupByArgs['orderBy'] }
        : { orderBy?: LoyaltyPointSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoyaltyPointSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoyaltyPointSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoyaltyPointSetting model
   */
  readonly fields: LoyaltyPointSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoyaltyPointSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoyaltyPointSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    loyaltyPoints<T extends LoyaltyPointSetting$loyaltyPointsArgs<ExtArgs> = {}>(args?: Subset<T, LoyaltyPointSetting$loyaltyPointsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoyaltyPointSetting model
   */
  interface LoyaltyPointSettingFieldRefs {
    readonly id: FieldRef<"LoyaltyPointSetting", 'String'>
    readonly description: FieldRef<"LoyaltyPointSetting", 'String'>
    readonly amount: FieldRef<"LoyaltyPointSetting", 'Float'>
    readonly equivalentPoint: FieldRef<"LoyaltyPointSetting", 'Float'>
    readonly createdAt: FieldRef<"LoyaltyPointSetting", 'DateTime'>
    readonly updatedAt: FieldRef<"LoyaltyPointSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoyaltyPointSetting findUnique
   */
  export type LoyaltyPointSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPointSetting to fetch.
     */
    where: LoyaltyPointSettingWhereUniqueInput
  }

  /**
   * LoyaltyPointSetting findUniqueOrThrow
   */
  export type LoyaltyPointSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPointSetting to fetch.
     */
    where: LoyaltyPointSettingWhereUniqueInput
  }

  /**
   * LoyaltyPointSetting findFirst
   */
  export type LoyaltyPointSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPointSetting to fetch.
     */
    where?: LoyaltyPointSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoyaltyPointSettings to fetch.
     */
    orderBy?: LoyaltyPointSettingOrderByWithRelationInput | LoyaltyPointSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoyaltyPointSettings.
     */
    cursor?: LoyaltyPointSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoyaltyPointSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoyaltyPointSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoyaltyPointSettings.
     */
    distinct?: LoyaltyPointSettingScalarFieldEnum | LoyaltyPointSettingScalarFieldEnum[]
  }

  /**
   * LoyaltyPointSetting findFirstOrThrow
   */
  export type LoyaltyPointSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPointSetting to fetch.
     */
    where?: LoyaltyPointSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoyaltyPointSettings to fetch.
     */
    orderBy?: LoyaltyPointSettingOrderByWithRelationInput | LoyaltyPointSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoyaltyPointSettings.
     */
    cursor?: LoyaltyPointSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoyaltyPointSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoyaltyPointSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoyaltyPointSettings.
     */
    distinct?: LoyaltyPointSettingScalarFieldEnum | LoyaltyPointSettingScalarFieldEnum[]
  }

  /**
   * LoyaltyPointSetting findMany
   */
  export type LoyaltyPointSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPointSettings to fetch.
     */
    where?: LoyaltyPointSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoyaltyPointSettings to fetch.
     */
    orderBy?: LoyaltyPointSettingOrderByWithRelationInput | LoyaltyPointSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoyaltyPointSettings.
     */
    cursor?: LoyaltyPointSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoyaltyPointSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoyaltyPointSettings.
     */
    skip?: number
    distinct?: LoyaltyPointSettingScalarFieldEnum | LoyaltyPointSettingScalarFieldEnum[]
  }

  /**
   * LoyaltyPointSetting create
   */
  export type LoyaltyPointSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
    /**
     * The data needed to create a LoyaltyPointSetting.
     */
    data: XOR<LoyaltyPointSettingCreateInput, LoyaltyPointSettingUncheckedCreateInput>
  }

  /**
   * LoyaltyPointSetting createMany
   */
  export type LoyaltyPointSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoyaltyPointSettings.
     */
    data: LoyaltyPointSettingCreateManyInput | LoyaltyPointSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoyaltyPointSetting update
   */
  export type LoyaltyPointSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
    /**
     * The data needed to update a LoyaltyPointSetting.
     */
    data: XOR<LoyaltyPointSettingUpdateInput, LoyaltyPointSettingUncheckedUpdateInput>
    /**
     * Choose, which LoyaltyPointSetting to update.
     */
    where: LoyaltyPointSettingWhereUniqueInput
  }

  /**
   * LoyaltyPointSetting updateMany
   */
  export type LoyaltyPointSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoyaltyPointSettings.
     */
    data: XOR<LoyaltyPointSettingUpdateManyMutationInput, LoyaltyPointSettingUncheckedUpdateManyInput>
    /**
     * Filter which LoyaltyPointSettings to update
     */
    where?: LoyaltyPointSettingWhereInput
    /**
     * Limit how many LoyaltyPointSettings to update.
     */
    limit?: number
  }

  /**
   * LoyaltyPointSetting upsert
   */
  export type LoyaltyPointSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
    /**
     * The filter to search for the LoyaltyPointSetting to update in case it exists.
     */
    where: LoyaltyPointSettingWhereUniqueInput
    /**
     * In case the LoyaltyPointSetting found by the `where` argument doesn't exist, create a new LoyaltyPointSetting with this data.
     */
    create: XOR<LoyaltyPointSettingCreateInput, LoyaltyPointSettingUncheckedCreateInput>
    /**
     * In case the LoyaltyPointSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoyaltyPointSettingUpdateInput, LoyaltyPointSettingUncheckedUpdateInput>
  }

  /**
   * LoyaltyPointSetting delete
   */
  export type LoyaltyPointSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
    /**
     * Filter which LoyaltyPointSetting to delete.
     */
    where: LoyaltyPointSettingWhereUniqueInput
  }

  /**
   * LoyaltyPointSetting deleteMany
   */
  export type LoyaltyPointSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyPointSettings to delete
     */
    where?: LoyaltyPointSettingWhereInput
    /**
     * Limit how many LoyaltyPointSettings to delete.
     */
    limit?: number
  }

  /**
   * LoyaltyPointSetting.loyaltyPoints
   */
  export type LoyaltyPointSetting$loyaltyPointsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    where?: LoyaltyPointWhereInput
    orderBy?: LoyaltyPointOrderByWithRelationInput | LoyaltyPointOrderByWithRelationInput[]
    cursor?: LoyaltyPointWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoyaltyPointScalarFieldEnum | LoyaltyPointScalarFieldEnum[]
  }

  /**
   * LoyaltyPointSetting without action
   */
  export type LoyaltyPointSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPointSetting
     */
    select?: LoyaltyPointSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPointSetting
     */
    omit?: LoyaltyPointSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointSettingInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerAvgAggregateOutputType = {
    creditLimit: number | null
  }

  export type CustomerSumAggregateOutputType = {
    creditLimit: number | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    code: string | null
    customerName: string | null
    contactFirstName: string | null
    address: string | null
    phonePrimary: string | null
    phoneAlternative: string | null
    email: string | null
    isActive: boolean | null
    creditLimit: number | null
    isTaxExempt: boolean | null
    paymentTerms: string | null
    paymentTermsValue: string | null
    salesperson: string | null
    customerGroup: string | null
    isEntitledToLoyaltyPoints: boolean | null
    pointSetting: string | null
    loyaltyCalculationMethod: string | null
    loyaltyCardNumber: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    code: string | null
    customerName: string | null
    contactFirstName: string | null
    address: string | null
    phonePrimary: string | null
    phoneAlternative: string | null
    email: string | null
    isActive: boolean | null
    creditLimit: number | null
    isTaxExempt: boolean | null
    paymentTerms: string | null
    paymentTermsValue: string | null
    salesperson: string | null
    customerGroup: string | null
    isEntitledToLoyaltyPoints: boolean | null
    pointSetting: string | null
    loyaltyCalculationMethod: string | null
    loyaltyCardNumber: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    code: number
    customerName: number
    contactFirstName: number
    address: number
    phonePrimary: number
    phoneAlternative: number
    email: number
    isActive: number
    creditLimit: number
    isTaxExempt: number
    paymentTerms: number
    paymentTermsValue: number
    salesperson: number
    customerGroup: number
    isEntitledToLoyaltyPoints: number
    pointSetting: number
    loyaltyCalculationMethod: number
    loyaltyCardNumber: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerAvgAggregateInputType = {
    creditLimit?: true
  }

  export type CustomerSumAggregateInputType = {
    creditLimit?: true
  }

  export type CustomerMinAggregateInputType = {
    id?: true
    code?: true
    customerName?: true
    contactFirstName?: true
    address?: true
    phonePrimary?: true
    phoneAlternative?: true
    email?: true
    isActive?: true
    creditLimit?: true
    isTaxExempt?: true
    paymentTerms?: true
    paymentTermsValue?: true
    salesperson?: true
    customerGroup?: true
    isEntitledToLoyaltyPoints?: true
    pointSetting?: true
    loyaltyCalculationMethod?: true
    loyaltyCardNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    code?: true
    customerName?: true
    contactFirstName?: true
    address?: true
    phonePrimary?: true
    phoneAlternative?: true
    email?: true
    isActive?: true
    creditLimit?: true
    isTaxExempt?: true
    paymentTerms?: true
    paymentTermsValue?: true
    salesperson?: true
    customerGroup?: true
    isEntitledToLoyaltyPoints?: true
    pointSetting?: true
    loyaltyCalculationMethod?: true
    loyaltyCardNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    code?: true
    customerName?: true
    contactFirstName?: true
    address?: true
    phonePrimary?: true
    phoneAlternative?: true
    email?: true
    isActive?: true
    creditLimit?: true
    isTaxExempt?: true
    paymentTerms?: true
    paymentTermsValue?: true
    salesperson?: true
    customerGroup?: true
    isEntitledToLoyaltyPoints?: true
    pointSetting?: true
    loyaltyCalculationMethod?: true
    loyaltyCardNumber?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _avg?: CustomerAvgAggregateInputType
    _sum?: CustomerSumAggregateInputType
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    code: string
    customerName: string
    contactFirstName: string | null
    address: string | null
    phonePrimary: string | null
    phoneAlternative: string | null
    email: string | null
    isActive: boolean
    creditLimit: number | null
    isTaxExempt: boolean
    paymentTerms: string | null
    paymentTermsValue: string | null
    salesperson: string | null
    customerGroup: string | null
    isEntitledToLoyaltyPoints: boolean
    pointSetting: string | null
    loyaltyCalculationMethod: string | null
    loyaltyCardNumber: string | null
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    customerName?: boolean
    contactFirstName?: boolean
    address?: boolean
    phonePrimary?: boolean
    phoneAlternative?: boolean
    email?: boolean
    isActive?: boolean
    creditLimit?: boolean
    isTaxExempt?: boolean
    paymentTerms?: boolean
    paymentTermsValue?: boolean
    salesperson?: boolean
    customerGroup?: boolean
    isEntitledToLoyaltyPoints?: boolean
    pointSetting?: boolean
    loyaltyCalculationMethod?: boolean
    loyaltyCardNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    loyaltyPoints?: boolean | Customer$loyaltyPointsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>



  export type CustomerSelectScalar = {
    id?: boolean
    code?: boolean
    customerName?: boolean
    contactFirstName?: boolean
    address?: boolean
    phonePrimary?: boolean
    phoneAlternative?: boolean
    email?: boolean
    isActive?: boolean
    creditLimit?: boolean
    isTaxExempt?: boolean
    paymentTerms?: boolean
    paymentTermsValue?: boolean
    salesperson?: boolean
    customerGroup?: boolean
    isEntitledToLoyaltyPoints?: boolean
    pointSetting?: boolean
    loyaltyCalculationMethod?: boolean
    loyaltyCardNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "customerName" | "contactFirstName" | "address" | "phonePrimary" | "phoneAlternative" | "email" | "isActive" | "creditLimit" | "isTaxExempt" | "paymentTerms" | "paymentTermsValue" | "salesperson" | "customerGroup" | "isEntitledToLoyaltyPoints" | "pointSetting" | "loyaltyCalculationMethod" | "loyaltyCardNumber" | "createdAt" | "updatedAt", ExtArgs["result"]["customer"]>
  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    loyaltyPoints?: boolean | Customer$loyaltyPointsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      loyaltyPoints: Prisma.$LoyaltyPointPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      customerName: string
      contactFirstName: string | null
      address: string | null
      phonePrimary: string | null
      phoneAlternative: string | null
      email: string | null
      isActive: boolean
      creditLimit: number | null
      isTaxExempt: boolean
      paymentTerms: string | null
      paymentTermsValue: string | null
      salesperson: string | null
      customerGroup: string | null
      isEntitledToLoyaltyPoints: boolean
      pointSetting: string | null
      loyaltyCalculationMethod: string | null
      loyaltyCardNumber: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    loyaltyPoints<T extends Customer$loyaltyPointsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$loyaltyPointsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly code: FieldRef<"Customer", 'String'>
    readonly customerName: FieldRef<"Customer", 'String'>
    readonly contactFirstName: FieldRef<"Customer", 'String'>
    readonly address: FieldRef<"Customer", 'String'>
    readonly phonePrimary: FieldRef<"Customer", 'String'>
    readonly phoneAlternative: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly isActive: FieldRef<"Customer", 'Boolean'>
    readonly creditLimit: FieldRef<"Customer", 'Float'>
    readonly isTaxExempt: FieldRef<"Customer", 'Boolean'>
    readonly paymentTerms: FieldRef<"Customer", 'String'>
    readonly paymentTermsValue: FieldRef<"Customer", 'String'>
    readonly salesperson: FieldRef<"Customer", 'String'>
    readonly customerGroup: FieldRef<"Customer", 'String'>
    readonly isEntitledToLoyaltyPoints: FieldRef<"Customer", 'Boolean'>
    readonly pointSetting: FieldRef<"Customer", 'String'>
    readonly loyaltyCalculationMethod: FieldRef<"Customer", 'String'>
    readonly loyaltyCardNumber: FieldRef<"Customer", 'String'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to delete.
     */
    limit?: number
  }

  /**
   * Customer.loyaltyPoints
   */
  export type Customer$loyaltyPointsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    where?: LoyaltyPointWhereInput
    orderBy?: LoyaltyPointOrderByWithRelationInput | LoyaltyPointOrderByWithRelationInput[]
    cursor?: LoyaltyPointWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoyaltyPointScalarFieldEnum | LoyaltyPointScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model LoyaltyPoint
   */

  export type AggregateLoyaltyPoint = {
    _count: LoyaltyPointCountAggregateOutputType | null
    _avg: LoyaltyPointAvgAggregateOutputType | null
    _sum: LoyaltyPointSumAggregateOutputType | null
    _min: LoyaltyPointMinAggregateOutputType | null
    _max: LoyaltyPointMaxAggregateOutputType | null
  }

  export type LoyaltyPointAvgAggregateOutputType = {
    totalPoints: number | null
  }

  export type LoyaltyPointSumAggregateOutputType = {
    totalPoints: number | null
  }

  export type LoyaltyPointMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    loyaltyCardId: string | null
    totalPoints: number | null
    pointSettingId: string | null
    expiryDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoyaltyPointMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    loyaltyCardId: string | null
    totalPoints: number | null
    pointSettingId: string | null
    expiryDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoyaltyPointCountAggregateOutputType = {
    id: number
    customerId: number
    loyaltyCardId: number
    totalPoints: number
    pointSettingId: number
    expiryDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LoyaltyPointAvgAggregateInputType = {
    totalPoints?: true
  }

  export type LoyaltyPointSumAggregateInputType = {
    totalPoints?: true
  }

  export type LoyaltyPointMinAggregateInputType = {
    id?: true
    customerId?: true
    loyaltyCardId?: true
    totalPoints?: true
    pointSettingId?: true
    expiryDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoyaltyPointMaxAggregateInputType = {
    id?: true
    customerId?: true
    loyaltyCardId?: true
    totalPoints?: true
    pointSettingId?: true
    expiryDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoyaltyPointCountAggregateInputType = {
    id?: true
    customerId?: true
    loyaltyCardId?: true
    totalPoints?: true
    pointSettingId?: true
    expiryDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LoyaltyPointAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyPoint to aggregate.
     */
    where?: LoyaltyPointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoyaltyPoints to fetch.
     */
    orderBy?: LoyaltyPointOrderByWithRelationInput | LoyaltyPointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoyaltyPointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoyaltyPoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoyaltyPoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoyaltyPoints
    **/
    _count?: true | LoyaltyPointCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoyaltyPointAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoyaltyPointSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoyaltyPointMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoyaltyPointMaxAggregateInputType
  }

  export type GetLoyaltyPointAggregateType<T extends LoyaltyPointAggregateArgs> = {
        [P in keyof T & keyof AggregateLoyaltyPoint]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoyaltyPoint[P]>
      : GetScalarType<T[P], AggregateLoyaltyPoint[P]>
  }




  export type LoyaltyPointGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoyaltyPointWhereInput
    orderBy?: LoyaltyPointOrderByWithAggregationInput | LoyaltyPointOrderByWithAggregationInput[]
    by: LoyaltyPointScalarFieldEnum[] | LoyaltyPointScalarFieldEnum
    having?: LoyaltyPointScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoyaltyPointCountAggregateInputType | true
    _avg?: LoyaltyPointAvgAggregateInputType
    _sum?: LoyaltyPointSumAggregateInputType
    _min?: LoyaltyPointMinAggregateInputType
    _max?: LoyaltyPointMaxAggregateInputType
  }

  export type LoyaltyPointGroupByOutputType = {
    id: string
    customerId: string
    loyaltyCardId: string
    totalPoints: number
    pointSettingId: string
    expiryDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: LoyaltyPointCountAggregateOutputType | null
    _avg: LoyaltyPointAvgAggregateOutputType | null
    _sum: LoyaltyPointSumAggregateOutputType | null
    _min: LoyaltyPointMinAggregateOutputType | null
    _max: LoyaltyPointMaxAggregateOutputType | null
  }

  type GetLoyaltyPointGroupByPayload<T extends LoyaltyPointGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoyaltyPointGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoyaltyPointGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoyaltyPointGroupByOutputType[P]>
            : GetScalarType<T[P], LoyaltyPointGroupByOutputType[P]>
        }
      >
    >


  export type LoyaltyPointSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    loyaltyCardId?: boolean
    totalPoints?: boolean
    pointSettingId?: boolean
    expiryDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    pointSetting?: boolean | LoyaltyPointSettingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loyaltyPoint"]>



  export type LoyaltyPointSelectScalar = {
    id?: boolean
    customerId?: boolean
    loyaltyCardId?: boolean
    totalPoints?: boolean
    pointSettingId?: boolean
    expiryDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LoyaltyPointOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "loyaltyCardId" | "totalPoints" | "pointSettingId" | "expiryDate" | "createdAt" | "updatedAt", ExtArgs["result"]["loyaltyPoint"]>
  export type LoyaltyPointInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    pointSetting?: boolean | LoyaltyPointSettingDefaultArgs<ExtArgs>
  }

  export type $LoyaltyPointPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoyaltyPoint"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      pointSetting: Prisma.$LoyaltyPointSettingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      loyaltyCardId: string
      totalPoints: number
      pointSettingId: string
      expiryDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["loyaltyPoint"]>
    composites: {}
  }

  type LoyaltyPointGetPayload<S extends boolean | null | undefined | LoyaltyPointDefaultArgs> = $Result.GetResult<Prisma.$LoyaltyPointPayload, S>

  type LoyaltyPointCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoyaltyPointFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoyaltyPointCountAggregateInputType | true
    }

  export interface LoyaltyPointDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoyaltyPoint'], meta: { name: 'LoyaltyPoint' } }
    /**
     * Find zero or one LoyaltyPoint that matches the filter.
     * @param {LoyaltyPointFindUniqueArgs} args - Arguments to find a LoyaltyPoint
     * @example
     * // Get one LoyaltyPoint
     * const loyaltyPoint = await prisma.loyaltyPoint.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoyaltyPointFindUniqueArgs>(args: SelectSubset<T, LoyaltyPointFindUniqueArgs<ExtArgs>>): Prisma__LoyaltyPointClient<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoyaltyPoint that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoyaltyPointFindUniqueOrThrowArgs} args - Arguments to find a LoyaltyPoint
     * @example
     * // Get one LoyaltyPoint
     * const loyaltyPoint = await prisma.loyaltyPoint.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoyaltyPointFindUniqueOrThrowArgs>(args: SelectSubset<T, LoyaltyPointFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoyaltyPointClient<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoyaltyPoint that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointFindFirstArgs} args - Arguments to find a LoyaltyPoint
     * @example
     * // Get one LoyaltyPoint
     * const loyaltyPoint = await prisma.loyaltyPoint.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoyaltyPointFindFirstArgs>(args?: SelectSubset<T, LoyaltyPointFindFirstArgs<ExtArgs>>): Prisma__LoyaltyPointClient<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoyaltyPoint that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointFindFirstOrThrowArgs} args - Arguments to find a LoyaltyPoint
     * @example
     * // Get one LoyaltyPoint
     * const loyaltyPoint = await prisma.loyaltyPoint.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoyaltyPointFindFirstOrThrowArgs>(args?: SelectSubset<T, LoyaltyPointFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoyaltyPointClient<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoyaltyPoints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoyaltyPoints
     * const loyaltyPoints = await prisma.loyaltyPoint.findMany()
     * 
     * // Get first 10 LoyaltyPoints
     * const loyaltyPoints = await prisma.loyaltyPoint.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loyaltyPointWithIdOnly = await prisma.loyaltyPoint.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoyaltyPointFindManyArgs>(args?: SelectSubset<T, LoyaltyPointFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoyaltyPoint.
     * @param {LoyaltyPointCreateArgs} args - Arguments to create a LoyaltyPoint.
     * @example
     * // Create one LoyaltyPoint
     * const LoyaltyPoint = await prisma.loyaltyPoint.create({
     *   data: {
     *     // ... data to create a LoyaltyPoint
     *   }
     * })
     * 
     */
    create<T extends LoyaltyPointCreateArgs>(args: SelectSubset<T, LoyaltyPointCreateArgs<ExtArgs>>): Prisma__LoyaltyPointClient<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoyaltyPoints.
     * @param {LoyaltyPointCreateManyArgs} args - Arguments to create many LoyaltyPoints.
     * @example
     * // Create many LoyaltyPoints
     * const loyaltyPoint = await prisma.loyaltyPoint.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoyaltyPointCreateManyArgs>(args?: SelectSubset<T, LoyaltyPointCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LoyaltyPoint.
     * @param {LoyaltyPointDeleteArgs} args - Arguments to delete one LoyaltyPoint.
     * @example
     * // Delete one LoyaltyPoint
     * const LoyaltyPoint = await prisma.loyaltyPoint.delete({
     *   where: {
     *     // ... filter to delete one LoyaltyPoint
     *   }
     * })
     * 
     */
    delete<T extends LoyaltyPointDeleteArgs>(args: SelectSubset<T, LoyaltyPointDeleteArgs<ExtArgs>>): Prisma__LoyaltyPointClient<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoyaltyPoint.
     * @param {LoyaltyPointUpdateArgs} args - Arguments to update one LoyaltyPoint.
     * @example
     * // Update one LoyaltyPoint
     * const loyaltyPoint = await prisma.loyaltyPoint.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoyaltyPointUpdateArgs>(args: SelectSubset<T, LoyaltyPointUpdateArgs<ExtArgs>>): Prisma__LoyaltyPointClient<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoyaltyPoints.
     * @param {LoyaltyPointDeleteManyArgs} args - Arguments to filter LoyaltyPoints to delete.
     * @example
     * // Delete a few LoyaltyPoints
     * const { count } = await prisma.loyaltyPoint.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoyaltyPointDeleteManyArgs>(args?: SelectSubset<T, LoyaltyPointDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoyaltyPoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoyaltyPoints
     * const loyaltyPoint = await prisma.loyaltyPoint.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoyaltyPointUpdateManyArgs>(args: SelectSubset<T, LoyaltyPointUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LoyaltyPoint.
     * @param {LoyaltyPointUpsertArgs} args - Arguments to update or create a LoyaltyPoint.
     * @example
     * // Update or create a LoyaltyPoint
     * const loyaltyPoint = await prisma.loyaltyPoint.upsert({
     *   create: {
     *     // ... data to create a LoyaltyPoint
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoyaltyPoint we want to update
     *   }
     * })
     */
    upsert<T extends LoyaltyPointUpsertArgs>(args: SelectSubset<T, LoyaltyPointUpsertArgs<ExtArgs>>): Prisma__LoyaltyPointClient<$Result.GetResult<Prisma.$LoyaltyPointPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoyaltyPoints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointCountArgs} args - Arguments to filter LoyaltyPoints to count.
     * @example
     * // Count the number of LoyaltyPoints
     * const count = await prisma.loyaltyPoint.count({
     *   where: {
     *     // ... the filter for the LoyaltyPoints we want to count
     *   }
     * })
    **/
    count<T extends LoyaltyPointCountArgs>(
      args?: Subset<T, LoyaltyPointCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoyaltyPointCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoyaltyPoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoyaltyPointAggregateArgs>(args: Subset<T, LoyaltyPointAggregateArgs>): Prisma.PrismaPromise<GetLoyaltyPointAggregateType<T>>

    /**
     * Group by LoyaltyPoint.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPointGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoyaltyPointGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoyaltyPointGroupByArgs['orderBy'] }
        : { orderBy?: LoyaltyPointGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoyaltyPointGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoyaltyPointGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoyaltyPoint model
   */
  readonly fields: LoyaltyPointFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoyaltyPoint.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoyaltyPointClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pointSetting<T extends LoyaltyPointSettingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LoyaltyPointSettingDefaultArgs<ExtArgs>>): Prisma__LoyaltyPointSettingClient<$Result.GetResult<Prisma.$LoyaltyPointSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoyaltyPoint model
   */
  interface LoyaltyPointFieldRefs {
    readonly id: FieldRef<"LoyaltyPoint", 'String'>
    readonly customerId: FieldRef<"LoyaltyPoint", 'String'>
    readonly loyaltyCardId: FieldRef<"LoyaltyPoint", 'String'>
    readonly totalPoints: FieldRef<"LoyaltyPoint", 'Float'>
    readonly pointSettingId: FieldRef<"LoyaltyPoint", 'String'>
    readonly expiryDate: FieldRef<"LoyaltyPoint", 'DateTime'>
    readonly createdAt: FieldRef<"LoyaltyPoint", 'DateTime'>
    readonly updatedAt: FieldRef<"LoyaltyPoint", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoyaltyPoint findUnique
   */
  export type LoyaltyPointFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPoint to fetch.
     */
    where: LoyaltyPointWhereUniqueInput
  }

  /**
   * LoyaltyPoint findUniqueOrThrow
   */
  export type LoyaltyPointFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPoint to fetch.
     */
    where: LoyaltyPointWhereUniqueInput
  }

  /**
   * LoyaltyPoint findFirst
   */
  export type LoyaltyPointFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPoint to fetch.
     */
    where?: LoyaltyPointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoyaltyPoints to fetch.
     */
    orderBy?: LoyaltyPointOrderByWithRelationInput | LoyaltyPointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoyaltyPoints.
     */
    cursor?: LoyaltyPointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoyaltyPoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoyaltyPoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoyaltyPoints.
     */
    distinct?: LoyaltyPointScalarFieldEnum | LoyaltyPointScalarFieldEnum[]
  }

  /**
   * LoyaltyPoint findFirstOrThrow
   */
  export type LoyaltyPointFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPoint to fetch.
     */
    where?: LoyaltyPointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoyaltyPoints to fetch.
     */
    orderBy?: LoyaltyPointOrderByWithRelationInput | LoyaltyPointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoyaltyPoints.
     */
    cursor?: LoyaltyPointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoyaltyPoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoyaltyPoints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoyaltyPoints.
     */
    distinct?: LoyaltyPointScalarFieldEnum | LoyaltyPointScalarFieldEnum[]
  }

  /**
   * LoyaltyPoint findMany
   */
  export type LoyaltyPointFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    /**
     * Filter, which LoyaltyPoints to fetch.
     */
    where?: LoyaltyPointWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoyaltyPoints to fetch.
     */
    orderBy?: LoyaltyPointOrderByWithRelationInput | LoyaltyPointOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoyaltyPoints.
     */
    cursor?: LoyaltyPointWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoyaltyPoints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoyaltyPoints.
     */
    skip?: number
    distinct?: LoyaltyPointScalarFieldEnum | LoyaltyPointScalarFieldEnum[]
  }

  /**
   * LoyaltyPoint create
   */
  export type LoyaltyPointCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    /**
     * The data needed to create a LoyaltyPoint.
     */
    data: XOR<LoyaltyPointCreateInput, LoyaltyPointUncheckedCreateInput>
  }

  /**
   * LoyaltyPoint createMany
   */
  export type LoyaltyPointCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoyaltyPoints.
     */
    data: LoyaltyPointCreateManyInput | LoyaltyPointCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoyaltyPoint update
   */
  export type LoyaltyPointUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    /**
     * The data needed to update a LoyaltyPoint.
     */
    data: XOR<LoyaltyPointUpdateInput, LoyaltyPointUncheckedUpdateInput>
    /**
     * Choose, which LoyaltyPoint to update.
     */
    where: LoyaltyPointWhereUniqueInput
  }

  /**
   * LoyaltyPoint updateMany
   */
  export type LoyaltyPointUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoyaltyPoints.
     */
    data: XOR<LoyaltyPointUpdateManyMutationInput, LoyaltyPointUncheckedUpdateManyInput>
    /**
     * Filter which LoyaltyPoints to update
     */
    where?: LoyaltyPointWhereInput
    /**
     * Limit how many LoyaltyPoints to update.
     */
    limit?: number
  }

  /**
   * LoyaltyPoint upsert
   */
  export type LoyaltyPointUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    /**
     * The filter to search for the LoyaltyPoint to update in case it exists.
     */
    where: LoyaltyPointWhereUniqueInput
    /**
     * In case the LoyaltyPoint found by the `where` argument doesn't exist, create a new LoyaltyPoint with this data.
     */
    create: XOR<LoyaltyPointCreateInput, LoyaltyPointUncheckedCreateInput>
    /**
     * In case the LoyaltyPoint was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoyaltyPointUpdateInput, LoyaltyPointUncheckedUpdateInput>
  }

  /**
   * LoyaltyPoint delete
   */
  export type LoyaltyPointDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
    /**
     * Filter which LoyaltyPoint to delete.
     */
    where: LoyaltyPointWhereUniqueInput
  }

  /**
   * LoyaltyPoint deleteMany
   */
  export type LoyaltyPointDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyPoints to delete
     */
    where?: LoyaltyPointWhereInput
    /**
     * Limit how many LoyaltyPoints to delete.
     */
    limit?: number
  }

  /**
   * LoyaltyPoint without action
   */
  export type LoyaltyPointDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPoint
     */
    select?: LoyaltyPointSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPoint
     */
    omit?: LoyaltyPointOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoyaltyPointInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    unitPrice: number | null
    costPrice: number | null
    stockQuantity: number | null
    minStockLevel: number | null
    maxStockLevel: number | null
    initialStock: number | null
    reorderPoint: number | null
  }

  export type ProductSumAggregateOutputType = {
    unitPrice: number | null
    costPrice: number | null
    stockQuantity: number | null
    minStockLevel: number | null
    maxStockLevel: number | null
    initialStock: number | null
    reorderPoint: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    barcode: string | null
    description: string | null
    additionalDescription: string | null
    category: string | null
    categoryId: string | null
    subcategoryId: string | null
    brandId: string | null
    supplierId: string | null
    unitOfMeasureId: string | null
    unitPrice: number | null
    costPrice: number | null
    stockQuantity: number | null
    minStockLevel: number | null
    maxStockLevel: number | null
    isActive: boolean | null
    salesOrder: string | null
    autoCreateChildren: boolean | null
    initialStock: number | null
    reorderPoint: number | null
    incomeAccountId: string | null
    expenseAccountId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    barcode: string | null
    description: string | null
    additionalDescription: string | null
    category: string | null
    categoryId: string | null
    subcategoryId: string | null
    brandId: string | null
    supplierId: string | null
    unitOfMeasureId: string | null
    unitPrice: number | null
    costPrice: number | null
    stockQuantity: number | null
    minStockLevel: number | null
    maxStockLevel: number | null
    isActive: boolean | null
    salesOrder: string | null
    autoCreateChildren: boolean | null
    initialStock: number | null
    reorderPoint: number | null
    incomeAccountId: string | null
    expenseAccountId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    code: number
    name: number
    barcode: number
    description: number
    additionalDescription: number
    category: number
    categoryId: number
    subcategoryId: number
    brandId: number
    supplierId: number
    unitOfMeasureId: number
    unitPrice: number
    costPrice: number
    stockQuantity: number
    minStockLevel: number
    maxStockLevel: number
    isActive: number
    salesOrder: number
    autoCreateChildren: number
    initialStock: number
    reorderPoint: number
    incomeAccountId: number
    expenseAccountId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    unitPrice?: true
    costPrice?: true
    stockQuantity?: true
    minStockLevel?: true
    maxStockLevel?: true
    initialStock?: true
    reorderPoint?: true
  }

  export type ProductSumAggregateInputType = {
    unitPrice?: true
    costPrice?: true
    stockQuantity?: true
    minStockLevel?: true
    maxStockLevel?: true
    initialStock?: true
    reorderPoint?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    barcode?: true
    description?: true
    additionalDescription?: true
    category?: true
    categoryId?: true
    subcategoryId?: true
    brandId?: true
    supplierId?: true
    unitOfMeasureId?: true
    unitPrice?: true
    costPrice?: true
    stockQuantity?: true
    minStockLevel?: true
    maxStockLevel?: true
    isActive?: true
    salesOrder?: true
    autoCreateChildren?: true
    initialStock?: true
    reorderPoint?: true
    incomeAccountId?: true
    expenseAccountId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    barcode?: true
    description?: true
    additionalDescription?: true
    category?: true
    categoryId?: true
    subcategoryId?: true
    brandId?: true
    supplierId?: true
    unitOfMeasureId?: true
    unitPrice?: true
    costPrice?: true
    stockQuantity?: true
    minStockLevel?: true
    maxStockLevel?: true
    isActive?: true
    salesOrder?: true
    autoCreateChildren?: true
    initialStock?: true
    reorderPoint?: true
    incomeAccountId?: true
    expenseAccountId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    barcode?: true
    description?: true
    additionalDescription?: true
    category?: true
    categoryId?: true
    subcategoryId?: true
    brandId?: true
    supplierId?: true
    unitOfMeasureId?: true
    unitPrice?: true
    costPrice?: true
    stockQuantity?: true
    minStockLevel?: true
    maxStockLevel?: true
    isActive?: true
    salesOrder?: true
    autoCreateChildren?: true
    initialStock?: true
    reorderPoint?: true
    incomeAccountId?: true
    expenseAccountId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    code: string
    name: string
    barcode: string | null
    description: string | null
    additionalDescription: string | null
    category: string | null
    categoryId: string | null
    subcategoryId: string | null
    brandId: string | null
    supplierId: string | null
    unitOfMeasureId: string | null
    unitPrice: number
    costPrice: number
    stockQuantity: number
    minStockLevel: number
    maxStockLevel: number | null
    isActive: boolean
    salesOrder: string | null
    autoCreateChildren: boolean
    initialStock: number
    reorderPoint: number
    incomeAccountId: string | null
    expenseAccountId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    barcode?: boolean
    description?: boolean
    additionalDescription?: boolean
    category?: boolean
    categoryId?: boolean
    subcategoryId?: boolean
    brandId?: boolean
    supplierId?: boolean
    unitOfMeasureId?: boolean
    unitPrice?: boolean
    costPrice?: boolean
    stockQuantity?: boolean
    minStockLevel?: boolean
    maxStockLevel?: boolean
    isActive?: boolean
    salesOrder?: boolean
    autoCreateChildren?: boolean
    initialStock?: boolean
    reorderPoint?: boolean
    incomeAccountId?: boolean
    expenseAccountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["product"]>



  export type ProductSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    barcode?: boolean
    description?: boolean
    additionalDescription?: boolean
    category?: boolean
    categoryId?: boolean
    subcategoryId?: boolean
    brandId?: boolean
    supplierId?: boolean
    unitOfMeasureId?: boolean
    unitPrice?: boolean
    costPrice?: boolean
    stockQuantity?: boolean
    minStockLevel?: boolean
    maxStockLevel?: boolean
    isActive?: boolean
    salesOrder?: boolean
    autoCreateChildren?: boolean
    initialStock?: boolean
    reorderPoint?: boolean
    incomeAccountId?: boolean
    expenseAccountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "barcode" | "description" | "additionalDescription" | "category" | "categoryId" | "subcategoryId" | "brandId" | "supplierId" | "unitOfMeasureId" | "unitPrice" | "costPrice" | "stockQuantity" | "minStockLevel" | "maxStockLevel" | "isActive" | "salesOrder" | "autoCreateChildren" | "initialStock" | "reorderPoint" | "incomeAccountId" | "expenseAccountId" | "createdAt" | "updatedAt", ExtArgs["result"]["product"]>

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      barcode: string | null
      description: string | null
      additionalDescription: string | null
      category: string | null
      categoryId: string | null
      subcategoryId: string | null
      brandId: string | null
      supplierId: string | null
      unitOfMeasureId: string | null
      unitPrice: number
      costPrice: number
      stockQuantity: number
      minStockLevel: number
      maxStockLevel: number | null
      isActive: boolean
      salesOrder: string | null
      autoCreateChildren: boolean
      initialStock: number
      reorderPoint: number
      incomeAccountId: string | null
      expenseAccountId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly code: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly barcode: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly additionalDescription: FieldRef<"Product", 'String'>
    readonly category: FieldRef<"Product", 'String'>
    readonly categoryId: FieldRef<"Product", 'String'>
    readonly subcategoryId: FieldRef<"Product", 'String'>
    readonly brandId: FieldRef<"Product", 'String'>
    readonly supplierId: FieldRef<"Product", 'String'>
    readonly unitOfMeasureId: FieldRef<"Product", 'String'>
    readonly unitPrice: FieldRef<"Product", 'Float'>
    readonly costPrice: FieldRef<"Product", 'Float'>
    readonly stockQuantity: FieldRef<"Product", 'Int'>
    readonly minStockLevel: FieldRef<"Product", 'Int'>
    readonly maxStockLevel: FieldRef<"Product", 'Int'>
    readonly isActive: FieldRef<"Product", 'Boolean'>
    readonly salesOrder: FieldRef<"Product", 'String'>
    readonly autoCreateChildren: FieldRef<"Product", 'Boolean'>
    readonly initialStock: FieldRef<"Product", 'Int'>
    readonly reorderPoint: FieldRef<"Product", 'Int'>
    readonly incomeAccountId: FieldRef<"Product", 'String'>
    readonly expenseAccountId: FieldRef<"Product", 'String'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
  }


  /**
   * Model ConversionFactor
   */

  export type AggregateConversionFactor = {
    _count: ConversionFactorCountAggregateOutputType | null
    _avg: ConversionFactorAvgAggregateOutputType | null
    _sum: ConversionFactorSumAggregateOutputType | null
    _min: ConversionFactorMinAggregateOutputType | null
    _max: ConversionFactorMaxAggregateOutputType | null
  }

  export type ConversionFactorAvgAggregateOutputType = {
    factor: number | null
  }

  export type ConversionFactorSumAggregateOutputType = {
    factor: number | null
  }

  export type ConversionFactorMinAggregateOutputType = {
    id: string | null
    productId: string | null
    unitName: string | null
    factor: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversionFactorMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    unitName: string | null
    factor: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversionFactorCountAggregateOutputType = {
    id: number
    productId: number
    unitName: number
    factor: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConversionFactorAvgAggregateInputType = {
    factor?: true
  }

  export type ConversionFactorSumAggregateInputType = {
    factor?: true
  }

  export type ConversionFactorMinAggregateInputType = {
    id?: true
    productId?: true
    unitName?: true
    factor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversionFactorMaxAggregateInputType = {
    id?: true
    productId?: true
    unitName?: true
    factor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversionFactorCountAggregateInputType = {
    id?: true
    productId?: true
    unitName?: true
    factor?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConversionFactorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversionFactor to aggregate.
     */
    where?: ConversionFactorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversionFactors to fetch.
     */
    orderBy?: ConversionFactorOrderByWithRelationInput | ConversionFactorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversionFactorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversionFactors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversionFactors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConversionFactors
    **/
    _count?: true | ConversionFactorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConversionFactorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConversionFactorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversionFactorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversionFactorMaxAggregateInputType
  }

  export type GetConversionFactorAggregateType<T extends ConversionFactorAggregateArgs> = {
        [P in keyof T & keyof AggregateConversionFactor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversionFactor[P]>
      : GetScalarType<T[P], AggregateConversionFactor[P]>
  }




  export type ConversionFactorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversionFactorWhereInput
    orderBy?: ConversionFactorOrderByWithAggregationInput | ConversionFactorOrderByWithAggregationInput[]
    by: ConversionFactorScalarFieldEnum[] | ConversionFactorScalarFieldEnum
    having?: ConversionFactorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversionFactorCountAggregateInputType | true
    _avg?: ConversionFactorAvgAggregateInputType
    _sum?: ConversionFactorSumAggregateInputType
    _min?: ConversionFactorMinAggregateInputType
    _max?: ConversionFactorMaxAggregateInputType
  }

  export type ConversionFactorGroupByOutputType = {
    id: string
    productId: string
    unitName: string
    factor: number
    createdAt: Date
    updatedAt: Date
    _count: ConversionFactorCountAggregateOutputType | null
    _avg: ConversionFactorAvgAggregateOutputType | null
    _sum: ConversionFactorSumAggregateOutputType | null
    _min: ConversionFactorMinAggregateOutputType | null
    _max: ConversionFactorMaxAggregateOutputType | null
  }

  type GetConversionFactorGroupByPayload<T extends ConversionFactorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversionFactorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversionFactorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversionFactorGroupByOutputType[P]>
            : GetScalarType<T[P], ConversionFactorGroupByOutputType[P]>
        }
      >
    >


  export type ConversionFactorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    unitName?: boolean
    factor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["conversionFactor"]>



  export type ConversionFactorSelectScalar = {
    id?: boolean
    productId?: boolean
    unitName?: boolean
    factor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConversionFactorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "unitName" | "factor" | "createdAt" | "updatedAt", ExtArgs["result"]["conversionFactor"]>

  export type $ConversionFactorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConversionFactor"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      unitName: string
      factor: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["conversionFactor"]>
    composites: {}
  }

  type ConversionFactorGetPayload<S extends boolean | null | undefined | ConversionFactorDefaultArgs> = $Result.GetResult<Prisma.$ConversionFactorPayload, S>

  type ConversionFactorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversionFactorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversionFactorCountAggregateInputType | true
    }

  export interface ConversionFactorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConversionFactor'], meta: { name: 'ConversionFactor' } }
    /**
     * Find zero or one ConversionFactor that matches the filter.
     * @param {ConversionFactorFindUniqueArgs} args - Arguments to find a ConversionFactor
     * @example
     * // Get one ConversionFactor
     * const conversionFactor = await prisma.conversionFactor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversionFactorFindUniqueArgs>(args: SelectSubset<T, ConversionFactorFindUniqueArgs<ExtArgs>>): Prisma__ConversionFactorClient<$Result.GetResult<Prisma.$ConversionFactorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConversionFactor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversionFactorFindUniqueOrThrowArgs} args - Arguments to find a ConversionFactor
     * @example
     * // Get one ConversionFactor
     * const conversionFactor = await prisma.conversionFactor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversionFactorFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversionFactorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversionFactorClient<$Result.GetResult<Prisma.$ConversionFactorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversionFactor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversionFactorFindFirstArgs} args - Arguments to find a ConversionFactor
     * @example
     * // Get one ConversionFactor
     * const conversionFactor = await prisma.conversionFactor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversionFactorFindFirstArgs>(args?: SelectSubset<T, ConversionFactorFindFirstArgs<ExtArgs>>): Prisma__ConversionFactorClient<$Result.GetResult<Prisma.$ConversionFactorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversionFactor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversionFactorFindFirstOrThrowArgs} args - Arguments to find a ConversionFactor
     * @example
     * // Get one ConversionFactor
     * const conversionFactor = await prisma.conversionFactor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversionFactorFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversionFactorFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversionFactorClient<$Result.GetResult<Prisma.$ConversionFactorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConversionFactors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversionFactorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConversionFactors
     * const conversionFactors = await prisma.conversionFactor.findMany()
     * 
     * // Get first 10 ConversionFactors
     * const conversionFactors = await prisma.conversionFactor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversionFactorWithIdOnly = await prisma.conversionFactor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversionFactorFindManyArgs>(args?: SelectSubset<T, ConversionFactorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversionFactorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConversionFactor.
     * @param {ConversionFactorCreateArgs} args - Arguments to create a ConversionFactor.
     * @example
     * // Create one ConversionFactor
     * const ConversionFactor = await prisma.conversionFactor.create({
     *   data: {
     *     // ... data to create a ConversionFactor
     *   }
     * })
     * 
     */
    create<T extends ConversionFactorCreateArgs>(args: SelectSubset<T, ConversionFactorCreateArgs<ExtArgs>>): Prisma__ConversionFactorClient<$Result.GetResult<Prisma.$ConversionFactorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConversionFactors.
     * @param {ConversionFactorCreateManyArgs} args - Arguments to create many ConversionFactors.
     * @example
     * // Create many ConversionFactors
     * const conversionFactor = await prisma.conversionFactor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversionFactorCreateManyArgs>(args?: SelectSubset<T, ConversionFactorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ConversionFactor.
     * @param {ConversionFactorDeleteArgs} args - Arguments to delete one ConversionFactor.
     * @example
     * // Delete one ConversionFactor
     * const ConversionFactor = await prisma.conversionFactor.delete({
     *   where: {
     *     // ... filter to delete one ConversionFactor
     *   }
     * })
     * 
     */
    delete<T extends ConversionFactorDeleteArgs>(args: SelectSubset<T, ConversionFactorDeleteArgs<ExtArgs>>): Prisma__ConversionFactorClient<$Result.GetResult<Prisma.$ConversionFactorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConversionFactor.
     * @param {ConversionFactorUpdateArgs} args - Arguments to update one ConversionFactor.
     * @example
     * // Update one ConversionFactor
     * const conversionFactor = await prisma.conversionFactor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversionFactorUpdateArgs>(args: SelectSubset<T, ConversionFactorUpdateArgs<ExtArgs>>): Prisma__ConversionFactorClient<$Result.GetResult<Prisma.$ConversionFactorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConversionFactors.
     * @param {ConversionFactorDeleteManyArgs} args - Arguments to filter ConversionFactors to delete.
     * @example
     * // Delete a few ConversionFactors
     * const { count } = await prisma.conversionFactor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversionFactorDeleteManyArgs>(args?: SelectSubset<T, ConversionFactorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversionFactors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversionFactorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConversionFactors
     * const conversionFactor = await prisma.conversionFactor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversionFactorUpdateManyArgs>(args: SelectSubset<T, ConversionFactorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConversionFactor.
     * @param {ConversionFactorUpsertArgs} args - Arguments to update or create a ConversionFactor.
     * @example
     * // Update or create a ConversionFactor
     * const conversionFactor = await prisma.conversionFactor.upsert({
     *   create: {
     *     // ... data to create a ConversionFactor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConversionFactor we want to update
     *   }
     * })
     */
    upsert<T extends ConversionFactorUpsertArgs>(args: SelectSubset<T, ConversionFactorUpsertArgs<ExtArgs>>): Prisma__ConversionFactorClient<$Result.GetResult<Prisma.$ConversionFactorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConversionFactors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversionFactorCountArgs} args - Arguments to filter ConversionFactors to count.
     * @example
     * // Count the number of ConversionFactors
     * const count = await prisma.conversionFactor.count({
     *   where: {
     *     // ... the filter for the ConversionFactors we want to count
     *   }
     * })
    **/
    count<T extends ConversionFactorCountArgs>(
      args?: Subset<T, ConversionFactorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversionFactorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConversionFactor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversionFactorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversionFactorAggregateArgs>(args: Subset<T, ConversionFactorAggregateArgs>): Prisma.PrismaPromise<GetConversionFactorAggregateType<T>>

    /**
     * Group by ConversionFactor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversionFactorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversionFactorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversionFactorGroupByArgs['orderBy'] }
        : { orderBy?: ConversionFactorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversionFactorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversionFactorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConversionFactor model
   */
  readonly fields: ConversionFactorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConversionFactor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversionFactorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConversionFactor model
   */
  interface ConversionFactorFieldRefs {
    readonly id: FieldRef<"ConversionFactor", 'String'>
    readonly productId: FieldRef<"ConversionFactor", 'String'>
    readonly unitName: FieldRef<"ConversionFactor", 'String'>
    readonly factor: FieldRef<"ConversionFactor", 'Float'>
    readonly createdAt: FieldRef<"ConversionFactor", 'DateTime'>
    readonly updatedAt: FieldRef<"ConversionFactor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConversionFactor findUnique
   */
  export type ConversionFactorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
    /**
     * Filter, which ConversionFactor to fetch.
     */
    where: ConversionFactorWhereUniqueInput
  }

  /**
   * ConversionFactor findUniqueOrThrow
   */
  export type ConversionFactorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
    /**
     * Filter, which ConversionFactor to fetch.
     */
    where: ConversionFactorWhereUniqueInput
  }

  /**
   * ConversionFactor findFirst
   */
  export type ConversionFactorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
    /**
     * Filter, which ConversionFactor to fetch.
     */
    where?: ConversionFactorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversionFactors to fetch.
     */
    orderBy?: ConversionFactorOrderByWithRelationInput | ConversionFactorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversionFactors.
     */
    cursor?: ConversionFactorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversionFactors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversionFactors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversionFactors.
     */
    distinct?: ConversionFactorScalarFieldEnum | ConversionFactorScalarFieldEnum[]
  }

  /**
   * ConversionFactor findFirstOrThrow
   */
  export type ConversionFactorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
    /**
     * Filter, which ConversionFactor to fetch.
     */
    where?: ConversionFactorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversionFactors to fetch.
     */
    orderBy?: ConversionFactorOrderByWithRelationInput | ConversionFactorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversionFactors.
     */
    cursor?: ConversionFactorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversionFactors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversionFactors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversionFactors.
     */
    distinct?: ConversionFactorScalarFieldEnum | ConversionFactorScalarFieldEnum[]
  }

  /**
   * ConversionFactor findMany
   */
  export type ConversionFactorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
    /**
     * Filter, which ConversionFactors to fetch.
     */
    where?: ConversionFactorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversionFactors to fetch.
     */
    orderBy?: ConversionFactorOrderByWithRelationInput | ConversionFactorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConversionFactors.
     */
    cursor?: ConversionFactorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversionFactors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversionFactors.
     */
    skip?: number
    distinct?: ConversionFactorScalarFieldEnum | ConversionFactorScalarFieldEnum[]
  }

  /**
   * ConversionFactor create
   */
  export type ConversionFactorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
    /**
     * The data needed to create a ConversionFactor.
     */
    data: XOR<ConversionFactorCreateInput, ConversionFactorUncheckedCreateInput>
  }

  /**
   * ConversionFactor createMany
   */
  export type ConversionFactorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConversionFactors.
     */
    data: ConversionFactorCreateManyInput | ConversionFactorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConversionFactor update
   */
  export type ConversionFactorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
    /**
     * The data needed to update a ConversionFactor.
     */
    data: XOR<ConversionFactorUpdateInput, ConversionFactorUncheckedUpdateInput>
    /**
     * Choose, which ConversionFactor to update.
     */
    where: ConversionFactorWhereUniqueInput
  }

  /**
   * ConversionFactor updateMany
   */
  export type ConversionFactorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConversionFactors.
     */
    data: XOR<ConversionFactorUpdateManyMutationInput, ConversionFactorUncheckedUpdateManyInput>
    /**
     * Filter which ConversionFactors to update
     */
    where?: ConversionFactorWhereInput
    /**
     * Limit how many ConversionFactors to update.
     */
    limit?: number
  }

  /**
   * ConversionFactor upsert
   */
  export type ConversionFactorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
    /**
     * The filter to search for the ConversionFactor to update in case it exists.
     */
    where: ConversionFactorWhereUniqueInput
    /**
     * In case the ConversionFactor found by the `where` argument doesn't exist, create a new ConversionFactor with this data.
     */
    create: XOR<ConversionFactorCreateInput, ConversionFactorUncheckedCreateInput>
    /**
     * In case the ConversionFactor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversionFactorUpdateInput, ConversionFactorUncheckedUpdateInput>
  }

  /**
   * ConversionFactor delete
   */
  export type ConversionFactorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
    /**
     * Filter which ConversionFactor to delete.
     */
    where: ConversionFactorWhereUniqueInput
  }

  /**
   * ConversionFactor deleteMany
   */
  export type ConversionFactorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversionFactors to delete
     */
    where?: ConversionFactorWhereInput
    /**
     * Limit how many ConversionFactors to delete.
     */
    limit?: number
  }

  /**
   * ConversionFactor without action
   */
  export type ConversionFactorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversionFactor
     */
    select?: ConversionFactorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversionFactor
     */
    omit?: ConversionFactorOmit<ExtArgs> | null
  }


  /**
   * Model Brand
   */

  export type AggregateBrand = {
    _count: BrandCountAggregateOutputType | null
    _min: BrandMinAggregateOutputType | null
    _max: BrandMaxAggregateOutputType | null
  }

  export type BrandMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BrandMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BrandCountAggregateOutputType = {
    id: number
    name: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BrandMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BrandMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BrandCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BrandAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Brand to aggregate.
     */
    where?: BrandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Brands to fetch.
     */
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BrandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Brands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Brands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Brands
    **/
    _count?: true | BrandCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BrandMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BrandMaxAggregateInputType
  }

  export type GetBrandAggregateType<T extends BrandAggregateArgs> = {
        [P in keyof T & keyof AggregateBrand]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBrand[P]>
      : GetScalarType<T[P], AggregateBrand[P]>
  }




  export type BrandGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BrandWhereInput
    orderBy?: BrandOrderByWithAggregationInput | BrandOrderByWithAggregationInput[]
    by: BrandScalarFieldEnum[] | BrandScalarFieldEnum
    having?: BrandScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BrandCountAggregateInputType | true
    _min?: BrandMinAggregateInputType
    _max?: BrandMaxAggregateInputType
  }

  export type BrandGroupByOutputType = {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: BrandCountAggregateOutputType | null
    _min: BrandMinAggregateOutputType | null
    _max: BrandMaxAggregateOutputType | null
  }

  type GetBrandGroupByPayload<T extends BrandGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BrandGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BrandGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BrandGroupByOutputType[P]>
            : GetScalarType<T[P], BrandGroupByOutputType[P]>
        }
      >
    >


  export type BrandSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["brand"]>



  export type BrandSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BrandOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["brand"]>

  export type $BrandPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Brand"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["brand"]>
    composites: {}
  }

  type BrandGetPayload<S extends boolean | null | undefined | BrandDefaultArgs> = $Result.GetResult<Prisma.$BrandPayload, S>

  type BrandCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BrandFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BrandCountAggregateInputType | true
    }

  export interface BrandDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Brand'], meta: { name: 'Brand' } }
    /**
     * Find zero or one Brand that matches the filter.
     * @param {BrandFindUniqueArgs} args - Arguments to find a Brand
     * @example
     * // Get one Brand
     * const brand = await prisma.brand.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BrandFindUniqueArgs>(args: SelectSubset<T, BrandFindUniqueArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Brand that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BrandFindUniqueOrThrowArgs} args - Arguments to find a Brand
     * @example
     * // Get one Brand
     * const brand = await prisma.brand.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BrandFindUniqueOrThrowArgs>(args: SelectSubset<T, BrandFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Brand that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandFindFirstArgs} args - Arguments to find a Brand
     * @example
     * // Get one Brand
     * const brand = await prisma.brand.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BrandFindFirstArgs>(args?: SelectSubset<T, BrandFindFirstArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Brand that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandFindFirstOrThrowArgs} args - Arguments to find a Brand
     * @example
     * // Get one Brand
     * const brand = await prisma.brand.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BrandFindFirstOrThrowArgs>(args?: SelectSubset<T, BrandFindFirstOrThrowArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Brands that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Brands
     * const brands = await prisma.brand.findMany()
     * 
     * // Get first 10 Brands
     * const brands = await prisma.brand.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const brandWithIdOnly = await prisma.brand.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BrandFindManyArgs>(args?: SelectSubset<T, BrandFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Brand.
     * @param {BrandCreateArgs} args - Arguments to create a Brand.
     * @example
     * // Create one Brand
     * const Brand = await prisma.brand.create({
     *   data: {
     *     // ... data to create a Brand
     *   }
     * })
     * 
     */
    create<T extends BrandCreateArgs>(args: SelectSubset<T, BrandCreateArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Brands.
     * @param {BrandCreateManyArgs} args - Arguments to create many Brands.
     * @example
     * // Create many Brands
     * const brand = await prisma.brand.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BrandCreateManyArgs>(args?: SelectSubset<T, BrandCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Brand.
     * @param {BrandDeleteArgs} args - Arguments to delete one Brand.
     * @example
     * // Delete one Brand
     * const Brand = await prisma.brand.delete({
     *   where: {
     *     // ... filter to delete one Brand
     *   }
     * })
     * 
     */
    delete<T extends BrandDeleteArgs>(args: SelectSubset<T, BrandDeleteArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Brand.
     * @param {BrandUpdateArgs} args - Arguments to update one Brand.
     * @example
     * // Update one Brand
     * const brand = await prisma.brand.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BrandUpdateArgs>(args: SelectSubset<T, BrandUpdateArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Brands.
     * @param {BrandDeleteManyArgs} args - Arguments to filter Brands to delete.
     * @example
     * // Delete a few Brands
     * const { count } = await prisma.brand.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BrandDeleteManyArgs>(args?: SelectSubset<T, BrandDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Brands.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Brands
     * const brand = await prisma.brand.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BrandUpdateManyArgs>(args: SelectSubset<T, BrandUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Brand.
     * @param {BrandUpsertArgs} args - Arguments to update or create a Brand.
     * @example
     * // Update or create a Brand
     * const brand = await prisma.brand.upsert({
     *   create: {
     *     // ... data to create a Brand
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Brand we want to update
     *   }
     * })
     */
    upsert<T extends BrandUpsertArgs>(args: SelectSubset<T, BrandUpsertArgs<ExtArgs>>): Prisma__BrandClient<$Result.GetResult<Prisma.$BrandPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Brands.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandCountArgs} args - Arguments to filter Brands to count.
     * @example
     * // Count the number of Brands
     * const count = await prisma.brand.count({
     *   where: {
     *     // ... the filter for the Brands we want to count
     *   }
     * })
    **/
    count<T extends BrandCountArgs>(
      args?: Subset<T, BrandCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BrandCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Brand.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BrandAggregateArgs>(args: Subset<T, BrandAggregateArgs>): Prisma.PrismaPromise<GetBrandAggregateType<T>>

    /**
     * Group by Brand.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BrandGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BrandGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BrandGroupByArgs['orderBy'] }
        : { orderBy?: BrandGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BrandGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBrandGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Brand model
   */
  readonly fields: BrandFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Brand.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BrandClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Brand model
   */
  interface BrandFieldRefs {
    readonly id: FieldRef<"Brand", 'String'>
    readonly name: FieldRef<"Brand", 'String'>
    readonly description: FieldRef<"Brand", 'String'>
    readonly createdAt: FieldRef<"Brand", 'DateTime'>
    readonly updatedAt: FieldRef<"Brand", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Brand findUnique
   */
  export type BrandFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Filter, which Brand to fetch.
     */
    where: BrandWhereUniqueInput
  }

  /**
   * Brand findUniqueOrThrow
   */
  export type BrandFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Filter, which Brand to fetch.
     */
    where: BrandWhereUniqueInput
  }

  /**
   * Brand findFirst
   */
  export type BrandFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Filter, which Brand to fetch.
     */
    where?: BrandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Brands to fetch.
     */
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Brands.
     */
    cursor?: BrandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Brands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Brands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Brands.
     */
    distinct?: BrandScalarFieldEnum | BrandScalarFieldEnum[]
  }

  /**
   * Brand findFirstOrThrow
   */
  export type BrandFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Filter, which Brand to fetch.
     */
    where?: BrandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Brands to fetch.
     */
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Brands.
     */
    cursor?: BrandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Brands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Brands.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Brands.
     */
    distinct?: BrandScalarFieldEnum | BrandScalarFieldEnum[]
  }

  /**
   * Brand findMany
   */
  export type BrandFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Filter, which Brands to fetch.
     */
    where?: BrandWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Brands to fetch.
     */
    orderBy?: BrandOrderByWithRelationInput | BrandOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Brands.
     */
    cursor?: BrandWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Brands from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Brands.
     */
    skip?: number
    distinct?: BrandScalarFieldEnum | BrandScalarFieldEnum[]
  }

  /**
   * Brand create
   */
  export type BrandCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * The data needed to create a Brand.
     */
    data: XOR<BrandCreateInput, BrandUncheckedCreateInput>
  }

  /**
   * Brand createMany
   */
  export type BrandCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Brands.
     */
    data: BrandCreateManyInput | BrandCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Brand update
   */
  export type BrandUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * The data needed to update a Brand.
     */
    data: XOR<BrandUpdateInput, BrandUncheckedUpdateInput>
    /**
     * Choose, which Brand to update.
     */
    where: BrandWhereUniqueInput
  }

  /**
   * Brand updateMany
   */
  export type BrandUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Brands.
     */
    data: XOR<BrandUpdateManyMutationInput, BrandUncheckedUpdateManyInput>
    /**
     * Filter which Brands to update
     */
    where?: BrandWhereInput
    /**
     * Limit how many Brands to update.
     */
    limit?: number
  }

  /**
   * Brand upsert
   */
  export type BrandUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * The filter to search for the Brand to update in case it exists.
     */
    where: BrandWhereUniqueInput
    /**
     * In case the Brand found by the `where` argument doesn't exist, create a new Brand with this data.
     */
    create: XOR<BrandCreateInput, BrandUncheckedCreateInput>
    /**
     * In case the Brand was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BrandUpdateInput, BrandUncheckedUpdateInput>
  }

  /**
   * Brand delete
   */
  export type BrandDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
    /**
     * Filter which Brand to delete.
     */
    where: BrandWhereUniqueInput
  }

  /**
   * Brand deleteMany
   */
  export type BrandDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Brands to delete
     */
    where?: BrandWhereInput
    /**
     * Limit how many Brands to delete.
     */
    limit?: number
  }

  /**
   * Brand without action
   */
  export type BrandDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Brand
     */
    select?: BrandSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Brand
     */
    omit?: BrandOmit<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    parentCategoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    parentCategoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    description: number
    parentCategoryId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    parentCategoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    parentCategoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    parentCategoryId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: string
    name: string
    description: string | null
    parentCategoryId: string | null
    createdAt: Date
    updatedAt: Date
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    parentCategoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["category"]>



  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    parentCategoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "parentCategoryId" | "createdAt" | "updatedAt", ExtArgs["result"]["category"]>

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      parentCategoryId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'String'>
    readonly name: FieldRef<"Category", 'String'>
    readonly description: FieldRef<"Category", 'String'>
    readonly parentCategoryId: FieldRef<"Category", 'String'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
    readonly updatedAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
  }


  /**
   * Model Supplier
   */

  export type AggregateSupplier = {
    _count: SupplierCountAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  export type SupplierMinAggregateOutputType = {
    id: string | null
    name: string | null
    contactPerson: string | null
    email: string | null
    phone: string | null
    address: string | null
    paymentTerms: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierMaxAggregateOutputType = {
    id: string | null
    name: string | null
    contactPerson: string | null
    email: string | null
    phone: string | null
    address: string | null
    paymentTerms: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierCountAggregateOutputType = {
    id: number
    name: number
    contactPerson: number
    email: number
    phone: number
    address: number
    paymentTerms: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupplierMinAggregateInputType = {
    id?: true
    name?: true
    contactPerson?: true
    email?: true
    phone?: true
    address?: true
    paymentTerms?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierMaxAggregateInputType = {
    id?: true
    name?: true
    contactPerson?: true
    email?: true
    phone?: true
    address?: true
    paymentTerms?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierCountAggregateInputType = {
    id?: true
    name?: true
    contactPerson?: true
    email?: true
    phone?: true
    address?: true
    paymentTerms?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupplierAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Supplier to aggregate.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Suppliers
    **/
    _count?: true | SupplierCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierMaxAggregateInputType
  }

  export type GetSupplierAggregateType<T extends SupplierAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplier]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplier[P]>
      : GetScalarType<T[P], AggregateSupplier[P]>
  }




  export type SupplierGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierWhereInput
    orderBy?: SupplierOrderByWithAggregationInput | SupplierOrderByWithAggregationInput[]
    by: SupplierScalarFieldEnum[] | SupplierScalarFieldEnum
    having?: SupplierScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierCountAggregateInputType | true
    _min?: SupplierMinAggregateInputType
    _max?: SupplierMaxAggregateInputType
  }

  export type SupplierGroupByOutputType = {
    id: string
    name: string
    contactPerson: string | null
    email: string | null
    phone: string | null
    address: string | null
    paymentTerms: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: SupplierCountAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  type GetSupplierGroupByPayload<T extends SupplierGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierGroupByOutputType[P]>
        }
      >
    >


  export type SupplierSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    contactPerson?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    paymentTerms?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplier"]>



  export type SupplierSelectScalar = {
    id?: boolean
    name?: boolean
    contactPerson?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    paymentTerms?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupplierOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "contactPerson" | "email" | "phone" | "address" | "paymentTerms" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["supplier"]>

  export type $SupplierPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Supplier"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      contactPerson: string | null
      email: string | null
      phone: string | null
      address: string | null
      paymentTerms: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supplier"]>
    composites: {}
  }

  type SupplierGetPayload<S extends boolean | null | undefined | SupplierDefaultArgs> = $Result.GetResult<Prisma.$SupplierPayload, S>

  type SupplierCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierCountAggregateInputType | true
    }

  export interface SupplierDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Supplier'], meta: { name: 'Supplier' } }
    /**
     * Find zero or one Supplier that matches the filter.
     * @param {SupplierFindUniqueArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierFindUniqueArgs>(args: SelectSubset<T, SupplierFindUniqueArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Supplier that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierFindUniqueOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierFindFirstArgs>(args?: SelectSubset<T, SupplierFindFirstArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Suppliers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Suppliers
     * const suppliers = await prisma.supplier.findMany()
     * 
     * // Get first 10 Suppliers
     * const suppliers = await prisma.supplier.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supplierWithIdOnly = await prisma.supplier.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupplierFindManyArgs>(args?: SelectSubset<T, SupplierFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Supplier.
     * @param {SupplierCreateArgs} args - Arguments to create a Supplier.
     * @example
     * // Create one Supplier
     * const Supplier = await prisma.supplier.create({
     *   data: {
     *     // ... data to create a Supplier
     *   }
     * })
     * 
     */
    create<T extends SupplierCreateArgs>(args: SelectSubset<T, SupplierCreateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Suppliers.
     * @param {SupplierCreateManyArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierCreateManyArgs>(args?: SelectSubset<T, SupplierCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Supplier.
     * @param {SupplierDeleteArgs} args - Arguments to delete one Supplier.
     * @example
     * // Delete one Supplier
     * const Supplier = await prisma.supplier.delete({
     *   where: {
     *     // ... filter to delete one Supplier
     *   }
     * })
     * 
     */
    delete<T extends SupplierDeleteArgs>(args: SelectSubset<T, SupplierDeleteArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Supplier.
     * @param {SupplierUpdateArgs} args - Arguments to update one Supplier.
     * @example
     * // Update one Supplier
     * const supplier = await prisma.supplier.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierUpdateArgs>(args: SelectSubset<T, SupplierUpdateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Suppliers.
     * @param {SupplierDeleteManyArgs} args - Arguments to filter Suppliers to delete.
     * @example
     * // Delete a few Suppliers
     * const { count } = await prisma.supplier.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierDeleteManyArgs>(args?: SelectSubset<T, SupplierDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierUpdateManyArgs>(args: SelectSubset<T, SupplierUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Supplier.
     * @param {SupplierUpsertArgs} args - Arguments to update or create a Supplier.
     * @example
     * // Update or create a Supplier
     * const supplier = await prisma.supplier.upsert({
     *   create: {
     *     // ... data to create a Supplier
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supplier we want to update
     *   }
     * })
     */
    upsert<T extends SupplierUpsertArgs>(args: SelectSubset<T, SupplierUpsertArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierCountArgs} args - Arguments to filter Suppliers to count.
     * @example
     * // Count the number of Suppliers
     * const count = await prisma.supplier.count({
     *   where: {
     *     // ... the filter for the Suppliers we want to count
     *   }
     * })
    **/
    count<T extends SupplierCountArgs>(
      args?: Subset<T, SupplierCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupplierAggregateArgs>(args: Subset<T, SupplierAggregateArgs>): Prisma.PrismaPromise<GetSupplierAggregateType<T>>

    /**
     * Group by Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupplierGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierGroupByArgs['orderBy'] }
        : { orderBy?: SupplierGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupplierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Supplier model
   */
  readonly fields: SupplierFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Supplier.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Supplier model
   */
  interface SupplierFieldRefs {
    readonly id: FieldRef<"Supplier", 'String'>
    readonly name: FieldRef<"Supplier", 'String'>
    readonly contactPerson: FieldRef<"Supplier", 'String'>
    readonly email: FieldRef<"Supplier", 'String'>
    readonly phone: FieldRef<"Supplier", 'String'>
    readonly address: FieldRef<"Supplier", 'String'>
    readonly paymentTerms: FieldRef<"Supplier", 'String'>
    readonly isActive: FieldRef<"Supplier", 'Boolean'>
    readonly createdAt: FieldRef<"Supplier", 'DateTime'>
    readonly updatedAt: FieldRef<"Supplier", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Supplier findUnique
   */
  export type SupplierFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findUniqueOrThrow
   */
  export type SupplierFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findFirst
   */
  export type SupplierFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findFirstOrThrow
   */
  export type SupplierFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findMany
   */
  export type SupplierFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Filter, which Suppliers to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier create
   */
  export type SupplierCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data needed to create a Supplier.
     */
    data: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
  }

  /**
   * Supplier createMany
   */
  export type SupplierCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Supplier update
   */
  export type SupplierUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data needed to update a Supplier.
     */
    data: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
    /**
     * Choose, which Supplier to update.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier updateMany
   */
  export type SupplierUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier upsert
   */
  export type SupplierUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The filter to search for the Supplier to update in case it exists.
     */
    where: SupplierWhereUniqueInput
    /**
     * In case the Supplier found by the `where` argument doesn't exist, create a new Supplier with this data.
     */
    create: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
    /**
     * In case the Supplier was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
  }

  /**
   * Supplier delete
   */
  export type SupplierDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Filter which Supplier to delete.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier deleteMany
   */
  export type SupplierDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Suppliers to delete
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to delete.
     */
    limit?: number
  }

  /**
   * Supplier without action
   */
  export type SupplierDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
  }


  /**
   * Model UnitOfMeasure
   */

  export type AggregateUnitOfMeasure = {
    _count: UnitOfMeasureCountAggregateOutputType | null
    _min: UnitOfMeasureMinAggregateOutputType | null
    _max: UnitOfMeasureMaxAggregateOutputType | null
  }

  export type UnitOfMeasureMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UnitOfMeasureMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UnitOfMeasureCountAggregateOutputType = {
    id: number
    code: number
    name: number
    description: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UnitOfMeasureMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UnitOfMeasureMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UnitOfMeasureCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UnitOfMeasureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnitOfMeasure to aggregate.
     */
    where?: UnitOfMeasureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnitOfMeasures to fetch.
     */
    orderBy?: UnitOfMeasureOrderByWithRelationInput | UnitOfMeasureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UnitOfMeasureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnitOfMeasures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnitOfMeasures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UnitOfMeasures
    **/
    _count?: true | UnitOfMeasureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnitOfMeasureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnitOfMeasureMaxAggregateInputType
  }

  export type GetUnitOfMeasureAggregateType<T extends UnitOfMeasureAggregateArgs> = {
        [P in keyof T & keyof AggregateUnitOfMeasure]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnitOfMeasure[P]>
      : GetScalarType<T[P], AggregateUnitOfMeasure[P]>
  }




  export type UnitOfMeasureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UnitOfMeasureWhereInput
    orderBy?: UnitOfMeasureOrderByWithAggregationInput | UnitOfMeasureOrderByWithAggregationInput[]
    by: UnitOfMeasureScalarFieldEnum[] | UnitOfMeasureScalarFieldEnum
    having?: UnitOfMeasureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnitOfMeasureCountAggregateInputType | true
    _min?: UnitOfMeasureMinAggregateInputType
    _max?: UnitOfMeasureMaxAggregateInputType
  }

  export type UnitOfMeasureGroupByOutputType = {
    id: string
    code: string
    name: string
    description: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UnitOfMeasureCountAggregateOutputType | null
    _min: UnitOfMeasureMinAggregateOutputType | null
    _max: UnitOfMeasureMaxAggregateOutputType | null
  }

  type GetUnitOfMeasureGroupByPayload<T extends UnitOfMeasureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UnitOfMeasureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnitOfMeasureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnitOfMeasureGroupByOutputType[P]>
            : GetScalarType<T[P], UnitOfMeasureGroupByOutputType[P]>
        }
      >
    >


  export type UnitOfMeasureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["unitOfMeasure"]>



  export type UnitOfMeasureSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UnitOfMeasureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "description" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["unitOfMeasure"]>

  export type $UnitOfMeasurePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UnitOfMeasure"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      description: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["unitOfMeasure"]>
    composites: {}
  }

  type UnitOfMeasureGetPayload<S extends boolean | null | undefined | UnitOfMeasureDefaultArgs> = $Result.GetResult<Prisma.$UnitOfMeasurePayload, S>

  type UnitOfMeasureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UnitOfMeasureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UnitOfMeasureCountAggregateInputType | true
    }

  export interface UnitOfMeasureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UnitOfMeasure'], meta: { name: 'UnitOfMeasure' } }
    /**
     * Find zero or one UnitOfMeasure that matches the filter.
     * @param {UnitOfMeasureFindUniqueArgs} args - Arguments to find a UnitOfMeasure
     * @example
     * // Get one UnitOfMeasure
     * const unitOfMeasure = await prisma.unitOfMeasure.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UnitOfMeasureFindUniqueArgs>(args: SelectSubset<T, UnitOfMeasureFindUniqueArgs<ExtArgs>>): Prisma__UnitOfMeasureClient<$Result.GetResult<Prisma.$UnitOfMeasurePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UnitOfMeasure that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UnitOfMeasureFindUniqueOrThrowArgs} args - Arguments to find a UnitOfMeasure
     * @example
     * // Get one UnitOfMeasure
     * const unitOfMeasure = await prisma.unitOfMeasure.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UnitOfMeasureFindUniqueOrThrowArgs>(args: SelectSubset<T, UnitOfMeasureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UnitOfMeasureClient<$Result.GetResult<Prisma.$UnitOfMeasurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnitOfMeasure that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitOfMeasureFindFirstArgs} args - Arguments to find a UnitOfMeasure
     * @example
     * // Get one UnitOfMeasure
     * const unitOfMeasure = await prisma.unitOfMeasure.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UnitOfMeasureFindFirstArgs>(args?: SelectSubset<T, UnitOfMeasureFindFirstArgs<ExtArgs>>): Prisma__UnitOfMeasureClient<$Result.GetResult<Prisma.$UnitOfMeasurePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnitOfMeasure that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitOfMeasureFindFirstOrThrowArgs} args - Arguments to find a UnitOfMeasure
     * @example
     * // Get one UnitOfMeasure
     * const unitOfMeasure = await prisma.unitOfMeasure.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UnitOfMeasureFindFirstOrThrowArgs>(args?: SelectSubset<T, UnitOfMeasureFindFirstOrThrowArgs<ExtArgs>>): Prisma__UnitOfMeasureClient<$Result.GetResult<Prisma.$UnitOfMeasurePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UnitOfMeasures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitOfMeasureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UnitOfMeasures
     * const unitOfMeasures = await prisma.unitOfMeasure.findMany()
     * 
     * // Get first 10 UnitOfMeasures
     * const unitOfMeasures = await prisma.unitOfMeasure.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const unitOfMeasureWithIdOnly = await prisma.unitOfMeasure.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UnitOfMeasureFindManyArgs>(args?: SelectSubset<T, UnitOfMeasureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnitOfMeasurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UnitOfMeasure.
     * @param {UnitOfMeasureCreateArgs} args - Arguments to create a UnitOfMeasure.
     * @example
     * // Create one UnitOfMeasure
     * const UnitOfMeasure = await prisma.unitOfMeasure.create({
     *   data: {
     *     // ... data to create a UnitOfMeasure
     *   }
     * })
     * 
     */
    create<T extends UnitOfMeasureCreateArgs>(args: SelectSubset<T, UnitOfMeasureCreateArgs<ExtArgs>>): Prisma__UnitOfMeasureClient<$Result.GetResult<Prisma.$UnitOfMeasurePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UnitOfMeasures.
     * @param {UnitOfMeasureCreateManyArgs} args - Arguments to create many UnitOfMeasures.
     * @example
     * // Create many UnitOfMeasures
     * const unitOfMeasure = await prisma.unitOfMeasure.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UnitOfMeasureCreateManyArgs>(args?: SelectSubset<T, UnitOfMeasureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UnitOfMeasure.
     * @param {UnitOfMeasureDeleteArgs} args - Arguments to delete one UnitOfMeasure.
     * @example
     * // Delete one UnitOfMeasure
     * const UnitOfMeasure = await prisma.unitOfMeasure.delete({
     *   where: {
     *     // ... filter to delete one UnitOfMeasure
     *   }
     * })
     * 
     */
    delete<T extends UnitOfMeasureDeleteArgs>(args: SelectSubset<T, UnitOfMeasureDeleteArgs<ExtArgs>>): Prisma__UnitOfMeasureClient<$Result.GetResult<Prisma.$UnitOfMeasurePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UnitOfMeasure.
     * @param {UnitOfMeasureUpdateArgs} args - Arguments to update one UnitOfMeasure.
     * @example
     * // Update one UnitOfMeasure
     * const unitOfMeasure = await prisma.unitOfMeasure.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UnitOfMeasureUpdateArgs>(args: SelectSubset<T, UnitOfMeasureUpdateArgs<ExtArgs>>): Prisma__UnitOfMeasureClient<$Result.GetResult<Prisma.$UnitOfMeasurePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UnitOfMeasures.
     * @param {UnitOfMeasureDeleteManyArgs} args - Arguments to filter UnitOfMeasures to delete.
     * @example
     * // Delete a few UnitOfMeasures
     * const { count } = await prisma.unitOfMeasure.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UnitOfMeasureDeleteManyArgs>(args?: SelectSubset<T, UnitOfMeasureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnitOfMeasures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitOfMeasureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UnitOfMeasures
     * const unitOfMeasure = await prisma.unitOfMeasure.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UnitOfMeasureUpdateManyArgs>(args: SelectSubset<T, UnitOfMeasureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UnitOfMeasure.
     * @param {UnitOfMeasureUpsertArgs} args - Arguments to update or create a UnitOfMeasure.
     * @example
     * // Update or create a UnitOfMeasure
     * const unitOfMeasure = await prisma.unitOfMeasure.upsert({
     *   create: {
     *     // ... data to create a UnitOfMeasure
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UnitOfMeasure we want to update
     *   }
     * })
     */
    upsert<T extends UnitOfMeasureUpsertArgs>(args: SelectSubset<T, UnitOfMeasureUpsertArgs<ExtArgs>>): Prisma__UnitOfMeasureClient<$Result.GetResult<Prisma.$UnitOfMeasurePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UnitOfMeasures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitOfMeasureCountArgs} args - Arguments to filter UnitOfMeasures to count.
     * @example
     * // Count the number of UnitOfMeasures
     * const count = await prisma.unitOfMeasure.count({
     *   where: {
     *     // ... the filter for the UnitOfMeasures we want to count
     *   }
     * })
    **/
    count<T extends UnitOfMeasureCountArgs>(
      args?: Subset<T, UnitOfMeasureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnitOfMeasureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UnitOfMeasure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitOfMeasureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UnitOfMeasureAggregateArgs>(args: Subset<T, UnitOfMeasureAggregateArgs>): Prisma.PrismaPromise<GetUnitOfMeasureAggregateType<T>>

    /**
     * Group by UnitOfMeasure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitOfMeasureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UnitOfMeasureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UnitOfMeasureGroupByArgs['orderBy'] }
        : { orderBy?: UnitOfMeasureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UnitOfMeasureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnitOfMeasureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UnitOfMeasure model
   */
  readonly fields: UnitOfMeasureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UnitOfMeasure.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UnitOfMeasureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UnitOfMeasure model
   */
  interface UnitOfMeasureFieldRefs {
    readonly id: FieldRef<"UnitOfMeasure", 'String'>
    readonly code: FieldRef<"UnitOfMeasure", 'String'>
    readonly name: FieldRef<"UnitOfMeasure", 'String'>
    readonly description: FieldRef<"UnitOfMeasure", 'String'>
    readonly isActive: FieldRef<"UnitOfMeasure", 'Boolean'>
    readonly createdAt: FieldRef<"UnitOfMeasure", 'DateTime'>
    readonly updatedAt: FieldRef<"UnitOfMeasure", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UnitOfMeasure findUnique
   */
  export type UnitOfMeasureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
    /**
     * Filter, which UnitOfMeasure to fetch.
     */
    where: UnitOfMeasureWhereUniqueInput
  }

  /**
   * UnitOfMeasure findUniqueOrThrow
   */
  export type UnitOfMeasureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
    /**
     * Filter, which UnitOfMeasure to fetch.
     */
    where: UnitOfMeasureWhereUniqueInput
  }

  /**
   * UnitOfMeasure findFirst
   */
  export type UnitOfMeasureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
    /**
     * Filter, which UnitOfMeasure to fetch.
     */
    where?: UnitOfMeasureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnitOfMeasures to fetch.
     */
    orderBy?: UnitOfMeasureOrderByWithRelationInput | UnitOfMeasureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnitOfMeasures.
     */
    cursor?: UnitOfMeasureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnitOfMeasures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnitOfMeasures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnitOfMeasures.
     */
    distinct?: UnitOfMeasureScalarFieldEnum | UnitOfMeasureScalarFieldEnum[]
  }

  /**
   * UnitOfMeasure findFirstOrThrow
   */
  export type UnitOfMeasureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
    /**
     * Filter, which UnitOfMeasure to fetch.
     */
    where?: UnitOfMeasureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnitOfMeasures to fetch.
     */
    orderBy?: UnitOfMeasureOrderByWithRelationInput | UnitOfMeasureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnitOfMeasures.
     */
    cursor?: UnitOfMeasureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnitOfMeasures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnitOfMeasures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnitOfMeasures.
     */
    distinct?: UnitOfMeasureScalarFieldEnum | UnitOfMeasureScalarFieldEnum[]
  }

  /**
   * UnitOfMeasure findMany
   */
  export type UnitOfMeasureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
    /**
     * Filter, which UnitOfMeasures to fetch.
     */
    where?: UnitOfMeasureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnitOfMeasures to fetch.
     */
    orderBy?: UnitOfMeasureOrderByWithRelationInput | UnitOfMeasureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UnitOfMeasures.
     */
    cursor?: UnitOfMeasureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnitOfMeasures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnitOfMeasures.
     */
    skip?: number
    distinct?: UnitOfMeasureScalarFieldEnum | UnitOfMeasureScalarFieldEnum[]
  }

  /**
   * UnitOfMeasure create
   */
  export type UnitOfMeasureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
    /**
     * The data needed to create a UnitOfMeasure.
     */
    data: XOR<UnitOfMeasureCreateInput, UnitOfMeasureUncheckedCreateInput>
  }

  /**
   * UnitOfMeasure createMany
   */
  export type UnitOfMeasureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UnitOfMeasures.
     */
    data: UnitOfMeasureCreateManyInput | UnitOfMeasureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UnitOfMeasure update
   */
  export type UnitOfMeasureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
    /**
     * The data needed to update a UnitOfMeasure.
     */
    data: XOR<UnitOfMeasureUpdateInput, UnitOfMeasureUncheckedUpdateInput>
    /**
     * Choose, which UnitOfMeasure to update.
     */
    where: UnitOfMeasureWhereUniqueInput
  }

  /**
   * UnitOfMeasure updateMany
   */
  export type UnitOfMeasureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UnitOfMeasures.
     */
    data: XOR<UnitOfMeasureUpdateManyMutationInput, UnitOfMeasureUncheckedUpdateManyInput>
    /**
     * Filter which UnitOfMeasures to update
     */
    where?: UnitOfMeasureWhereInput
    /**
     * Limit how many UnitOfMeasures to update.
     */
    limit?: number
  }

  /**
   * UnitOfMeasure upsert
   */
  export type UnitOfMeasureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
    /**
     * The filter to search for the UnitOfMeasure to update in case it exists.
     */
    where: UnitOfMeasureWhereUniqueInput
    /**
     * In case the UnitOfMeasure found by the `where` argument doesn't exist, create a new UnitOfMeasure with this data.
     */
    create: XOR<UnitOfMeasureCreateInput, UnitOfMeasureUncheckedCreateInput>
    /**
     * In case the UnitOfMeasure was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UnitOfMeasureUpdateInput, UnitOfMeasureUncheckedUpdateInput>
  }

  /**
   * UnitOfMeasure delete
   */
  export type UnitOfMeasureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
    /**
     * Filter which UnitOfMeasure to delete.
     */
    where: UnitOfMeasureWhereUniqueInput
  }

  /**
   * UnitOfMeasure deleteMany
   */
  export type UnitOfMeasureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnitOfMeasures to delete
     */
    where?: UnitOfMeasureWhereInput
    /**
     * Limit how many UnitOfMeasures to delete.
     */
    limit?: number
  }

  /**
   * UnitOfMeasure without action
   */
  export type UnitOfMeasureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnitOfMeasure
     */
    select?: UnitOfMeasureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnitOfMeasure
     */
    omit?: UnitOfMeasureOmit<ExtArgs> | null
  }


  /**
   * Model Reminder
   */

  export type AggregateReminder = {
    _count: ReminderCountAggregateOutputType | null
    _min: ReminderMinAggregateOutputType | null
    _max: ReminderMaxAggregateOutputType | null
  }

  export type ReminderMinAggregateOutputType = {
    id: string | null
    title: string | null
    memo: string | null
    date: Date | null
    endDate: Date | null
    isActive: boolean | null
    isRead: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReminderMaxAggregateOutputType = {
    id: string | null
    title: string | null
    memo: string | null
    date: Date | null
    endDate: Date | null
    isActive: boolean | null
    isRead: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReminderCountAggregateOutputType = {
    id: number
    title: number
    memo: number
    date: number
    endDate: number
    isActive: number
    isRead: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReminderMinAggregateInputType = {
    id?: true
    title?: true
    memo?: true
    date?: true
    endDate?: true
    isActive?: true
    isRead?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReminderMaxAggregateInputType = {
    id?: true
    title?: true
    memo?: true
    date?: true
    endDate?: true
    isActive?: true
    isRead?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReminderCountAggregateInputType = {
    id?: true
    title?: true
    memo?: true
    date?: true
    endDate?: true
    isActive?: true
    isRead?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReminderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reminder to aggregate.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reminders to fetch.
     */
    orderBy?: ReminderOrderByWithRelationInput | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reminders
    **/
    _count?: true | ReminderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReminderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReminderMaxAggregateInputType
  }

  export type GetReminderAggregateType<T extends ReminderAggregateArgs> = {
        [P in keyof T & keyof AggregateReminder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReminder[P]>
      : GetScalarType<T[P], AggregateReminder[P]>
  }




  export type ReminderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReminderWhereInput
    orderBy?: ReminderOrderByWithAggregationInput | ReminderOrderByWithAggregationInput[]
    by: ReminderScalarFieldEnum[] | ReminderScalarFieldEnum
    having?: ReminderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReminderCountAggregateInputType | true
    _min?: ReminderMinAggregateInputType
    _max?: ReminderMaxAggregateInputType
  }

  export type ReminderGroupByOutputType = {
    id: string
    title: string
    memo: string | null
    date: Date
    endDate: Date | null
    isActive: boolean
    isRead: boolean
    createdAt: Date
    updatedAt: Date
    _count: ReminderCountAggregateOutputType | null
    _min: ReminderMinAggregateOutputType | null
    _max: ReminderMaxAggregateOutputType | null
  }

  type GetReminderGroupByPayload<T extends ReminderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReminderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReminderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReminderGroupByOutputType[P]>
            : GetScalarType<T[P], ReminderGroupByOutputType[P]>
        }
      >
    >


  export type ReminderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    memo?: boolean
    date?: boolean
    endDate?: boolean
    isActive?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["reminder"]>



  export type ReminderSelectScalar = {
    id?: boolean
    title?: boolean
    memo?: boolean
    date?: boolean
    endDate?: boolean
    isActive?: boolean
    isRead?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReminderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "memo" | "date" | "endDate" | "isActive" | "isRead" | "createdAt" | "updatedAt", ExtArgs["result"]["reminder"]>

  export type $ReminderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reminder"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      memo: string | null
      date: Date
      endDate: Date | null
      isActive: boolean
      isRead: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["reminder"]>
    composites: {}
  }

  type ReminderGetPayload<S extends boolean | null | undefined | ReminderDefaultArgs> = $Result.GetResult<Prisma.$ReminderPayload, S>

  type ReminderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReminderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReminderCountAggregateInputType | true
    }

  export interface ReminderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reminder'], meta: { name: 'Reminder' } }
    /**
     * Find zero or one Reminder that matches the filter.
     * @param {ReminderFindUniqueArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReminderFindUniqueArgs>(args: SelectSubset<T, ReminderFindUniqueArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reminder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReminderFindUniqueOrThrowArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReminderFindUniqueOrThrowArgs>(args: SelectSubset<T, ReminderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reminder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderFindFirstArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReminderFindFirstArgs>(args?: SelectSubset<T, ReminderFindFirstArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reminder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderFindFirstOrThrowArgs} args - Arguments to find a Reminder
     * @example
     * // Get one Reminder
     * const reminder = await prisma.reminder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReminderFindFirstOrThrowArgs>(args?: SelectSubset<T, ReminderFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reminders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reminders
     * const reminders = await prisma.reminder.findMany()
     * 
     * // Get first 10 Reminders
     * const reminders = await prisma.reminder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reminderWithIdOnly = await prisma.reminder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReminderFindManyArgs>(args?: SelectSubset<T, ReminderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reminder.
     * @param {ReminderCreateArgs} args - Arguments to create a Reminder.
     * @example
     * // Create one Reminder
     * const Reminder = await prisma.reminder.create({
     *   data: {
     *     // ... data to create a Reminder
     *   }
     * })
     * 
     */
    create<T extends ReminderCreateArgs>(args: SelectSubset<T, ReminderCreateArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reminders.
     * @param {ReminderCreateManyArgs} args - Arguments to create many Reminders.
     * @example
     * // Create many Reminders
     * const reminder = await prisma.reminder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReminderCreateManyArgs>(args?: SelectSubset<T, ReminderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Reminder.
     * @param {ReminderDeleteArgs} args - Arguments to delete one Reminder.
     * @example
     * // Delete one Reminder
     * const Reminder = await prisma.reminder.delete({
     *   where: {
     *     // ... filter to delete one Reminder
     *   }
     * })
     * 
     */
    delete<T extends ReminderDeleteArgs>(args: SelectSubset<T, ReminderDeleteArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reminder.
     * @param {ReminderUpdateArgs} args - Arguments to update one Reminder.
     * @example
     * // Update one Reminder
     * const reminder = await prisma.reminder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReminderUpdateArgs>(args: SelectSubset<T, ReminderUpdateArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reminders.
     * @param {ReminderDeleteManyArgs} args - Arguments to filter Reminders to delete.
     * @example
     * // Delete a few Reminders
     * const { count } = await prisma.reminder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReminderDeleteManyArgs>(args?: SelectSubset<T, ReminderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reminders
     * const reminder = await prisma.reminder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReminderUpdateManyArgs>(args: SelectSubset<T, ReminderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reminder.
     * @param {ReminderUpsertArgs} args - Arguments to update or create a Reminder.
     * @example
     * // Update or create a Reminder
     * const reminder = await prisma.reminder.upsert({
     *   create: {
     *     // ... data to create a Reminder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reminder we want to update
     *   }
     * })
     */
    upsert<T extends ReminderUpsertArgs>(args: SelectSubset<T, ReminderUpsertArgs<ExtArgs>>): Prisma__ReminderClient<$Result.GetResult<Prisma.$ReminderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reminders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderCountArgs} args - Arguments to filter Reminders to count.
     * @example
     * // Count the number of Reminders
     * const count = await prisma.reminder.count({
     *   where: {
     *     // ... the filter for the Reminders we want to count
     *   }
     * })
    **/
    count<T extends ReminderCountArgs>(
      args?: Subset<T, ReminderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReminderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reminder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReminderAggregateArgs>(args: Subset<T, ReminderAggregateArgs>): Prisma.PrismaPromise<GetReminderAggregateType<T>>

    /**
     * Group by Reminder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReminderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReminderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReminderGroupByArgs['orderBy'] }
        : { orderBy?: ReminderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReminderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReminderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reminder model
   */
  readonly fields: ReminderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reminder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReminderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reminder model
   */
  interface ReminderFieldRefs {
    readonly id: FieldRef<"Reminder", 'String'>
    readonly title: FieldRef<"Reminder", 'String'>
    readonly memo: FieldRef<"Reminder", 'String'>
    readonly date: FieldRef<"Reminder", 'DateTime'>
    readonly endDate: FieldRef<"Reminder", 'DateTime'>
    readonly isActive: FieldRef<"Reminder", 'Boolean'>
    readonly isRead: FieldRef<"Reminder", 'Boolean'>
    readonly createdAt: FieldRef<"Reminder", 'DateTime'>
    readonly updatedAt: FieldRef<"Reminder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Reminder findUnique
   */
  export type ReminderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder findUniqueOrThrow
   */
  export type ReminderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder findFirst
   */
  export type ReminderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reminders to fetch.
     */
    orderBy?: ReminderOrderByWithRelationInput | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reminders.
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reminders.
     */
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * Reminder findFirstOrThrow
   */
  export type ReminderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
    /**
     * Filter, which Reminder to fetch.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reminders to fetch.
     */
    orderBy?: ReminderOrderByWithRelationInput | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reminders.
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reminders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reminders.
     */
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * Reminder findMany
   */
  export type ReminderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
    /**
     * Filter, which Reminders to fetch.
     */
    where?: ReminderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reminders to fetch.
     */
    orderBy?: ReminderOrderByWithRelationInput | ReminderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reminders.
     */
    cursor?: ReminderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reminders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reminders.
     */
    skip?: number
    distinct?: ReminderScalarFieldEnum | ReminderScalarFieldEnum[]
  }

  /**
   * Reminder create
   */
  export type ReminderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
    /**
     * The data needed to create a Reminder.
     */
    data: XOR<ReminderCreateInput, ReminderUncheckedCreateInput>
  }

  /**
   * Reminder createMany
   */
  export type ReminderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reminders.
     */
    data: ReminderCreateManyInput | ReminderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reminder update
   */
  export type ReminderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
    /**
     * The data needed to update a Reminder.
     */
    data: XOR<ReminderUpdateInput, ReminderUncheckedUpdateInput>
    /**
     * Choose, which Reminder to update.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder updateMany
   */
  export type ReminderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reminders.
     */
    data: XOR<ReminderUpdateManyMutationInput, ReminderUncheckedUpdateManyInput>
    /**
     * Filter which Reminders to update
     */
    where?: ReminderWhereInput
    /**
     * Limit how many Reminders to update.
     */
    limit?: number
  }

  /**
   * Reminder upsert
   */
  export type ReminderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
    /**
     * The filter to search for the Reminder to update in case it exists.
     */
    where: ReminderWhereUniqueInput
    /**
     * In case the Reminder found by the `where` argument doesn't exist, create a new Reminder with this data.
     */
    create: XOR<ReminderCreateInput, ReminderUncheckedCreateInput>
    /**
     * In case the Reminder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReminderUpdateInput, ReminderUncheckedUpdateInput>
  }

  /**
   * Reminder delete
   */
  export type ReminderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
    /**
     * Filter which Reminder to delete.
     */
    where: ReminderWhereUniqueInput
  }

  /**
   * Reminder deleteMany
   */
  export type ReminderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reminders to delete
     */
    where?: ReminderWhereInput
    /**
     * Limit how many Reminders to delete.
     */
    limit?: number
  }

  /**
   * Reminder without action
   */
  export type ReminderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reminder
     */
    select?: ReminderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reminder
     */
    omit?: ReminderOmit<ExtArgs> | null
  }


  /**
   * Model SalesUser
   */

  export type AggregateSalesUser = {
    _count: SalesUserCountAggregateOutputType | null
    _min: SalesUserMinAggregateOutputType | null
    _max: SalesUserMaxAggregateOutputType | null
  }

  export type SalesUserMinAggregateOutputType = {
    id: string | null
    name: string | null
    uniqueId: string | null
    username: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalesUserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    uniqueId: string | null
    username: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalesUserCountAggregateOutputType = {
    id: number
    name: number
    uniqueId: number
    username: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SalesUserMinAggregateInputType = {
    id?: true
    name?: true
    uniqueId?: true
    username?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalesUserMaxAggregateInputType = {
    id?: true
    name?: true
    uniqueId?: true
    username?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalesUserCountAggregateInputType = {
    id?: true
    name?: true
    uniqueId?: true
    username?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SalesUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesUser to aggregate.
     */
    where?: SalesUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesUsers to fetch.
     */
    orderBy?: SalesUserOrderByWithRelationInput | SalesUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SalesUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SalesUsers
    **/
    _count?: true | SalesUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SalesUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SalesUserMaxAggregateInputType
  }

  export type GetSalesUserAggregateType<T extends SalesUserAggregateArgs> = {
        [P in keyof T & keyof AggregateSalesUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSalesUser[P]>
      : GetScalarType<T[P], AggregateSalesUser[P]>
  }




  export type SalesUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesUserWhereInput
    orderBy?: SalesUserOrderByWithAggregationInput | SalesUserOrderByWithAggregationInput[]
    by: SalesUserScalarFieldEnum[] | SalesUserScalarFieldEnum
    having?: SalesUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SalesUserCountAggregateInputType | true
    _min?: SalesUserMinAggregateInputType
    _max?: SalesUserMaxAggregateInputType
  }

  export type SalesUserGroupByOutputType = {
    id: string
    name: string
    uniqueId: string
    username: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: SalesUserCountAggregateOutputType | null
    _min: SalesUserMinAggregateOutputType | null
    _max: SalesUserMaxAggregateOutputType | null
  }

  type GetSalesUserGroupByPayload<T extends SalesUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SalesUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SalesUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SalesUserGroupByOutputType[P]>
            : GetScalarType<T[P], SalesUserGroupByOutputType[P]>
        }
      >
    >


  export type SalesUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    uniqueId?: boolean
    username?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["salesUser"]>



  export type SalesUserSelectScalar = {
    id?: boolean
    name?: boolean
    uniqueId?: boolean
    username?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SalesUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "uniqueId" | "username" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["salesUser"]>

  export type $SalesUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SalesUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      uniqueId: string
      username: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["salesUser"]>
    composites: {}
  }

  type SalesUserGetPayload<S extends boolean | null | undefined | SalesUserDefaultArgs> = $Result.GetResult<Prisma.$SalesUserPayload, S>

  type SalesUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SalesUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SalesUserCountAggregateInputType | true
    }

  export interface SalesUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SalesUser'], meta: { name: 'SalesUser' } }
    /**
     * Find zero or one SalesUser that matches the filter.
     * @param {SalesUserFindUniqueArgs} args - Arguments to find a SalesUser
     * @example
     * // Get one SalesUser
     * const salesUser = await prisma.salesUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SalesUserFindUniqueArgs>(args: SelectSubset<T, SalesUserFindUniqueArgs<ExtArgs>>): Prisma__SalesUserClient<$Result.GetResult<Prisma.$SalesUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SalesUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SalesUserFindUniqueOrThrowArgs} args - Arguments to find a SalesUser
     * @example
     * // Get one SalesUser
     * const salesUser = await prisma.salesUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SalesUserFindUniqueOrThrowArgs>(args: SelectSubset<T, SalesUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SalesUserClient<$Result.GetResult<Prisma.$SalesUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SalesUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesUserFindFirstArgs} args - Arguments to find a SalesUser
     * @example
     * // Get one SalesUser
     * const salesUser = await prisma.salesUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SalesUserFindFirstArgs>(args?: SelectSubset<T, SalesUserFindFirstArgs<ExtArgs>>): Prisma__SalesUserClient<$Result.GetResult<Prisma.$SalesUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SalesUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesUserFindFirstOrThrowArgs} args - Arguments to find a SalesUser
     * @example
     * // Get one SalesUser
     * const salesUser = await prisma.salesUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SalesUserFindFirstOrThrowArgs>(args?: SelectSubset<T, SalesUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__SalesUserClient<$Result.GetResult<Prisma.$SalesUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SalesUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SalesUsers
     * const salesUsers = await prisma.salesUser.findMany()
     * 
     * // Get first 10 SalesUsers
     * const salesUsers = await prisma.salesUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const salesUserWithIdOnly = await prisma.salesUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SalesUserFindManyArgs>(args?: SelectSubset<T, SalesUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SalesUser.
     * @param {SalesUserCreateArgs} args - Arguments to create a SalesUser.
     * @example
     * // Create one SalesUser
     * const SalesUser = await prisma.salesUser.create({
     *   data: {
     *     // ... data to create a SalesUser
     *   }
     * })
     * 
     */
    create<T extends SalesUserCreateArgs>(args: SelectSubset<T, SalesUserCreateArgs<ExtArgs>>): Prisma__SalesUserClient<$Result.GetResult<Prisma.$SalesUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SalesUsers.
     * @param {SalesUserCreateManyArgs} args - Arguments to create many SalesUsers.
     * @example
     * // Create many SalesUsers
     * const salesUser = await prisma.salesUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SalesUserCreateManyArgs>(args?: SelectSubset<T, SalesUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SalesUser.
     * @param {SalesUserDeleteArgs} args - Arguments to delete one SalesUser.
     * @example
     * // Delete one SalesUser
     * const SalesUser = await prisma.salesUser.delete({
     *   where: {
     *     // ... filter to delete one SalesUser
     *   }
     * })
     * 
     */
    delete<T extends SalesUserDeleteArgs>(args: SelectSubset<T, SalesUserDeleteArgs<ExtArgs>>): Prisma__SalesUserClient<$Result.GetResult<Prisma.$SalesUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SalesUser.
     * @param {SalesUserUpdateArgs} args - Arguments to update one SalesUser.
     * @example
     * // Update one SalesUser
     * const salesUser = await prisma.salesUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SalesUserUpdateArgs>(args: SelectSubset<T, SalesUserUpdateArgs<ExtArgs>>): Prisma__SalesUserClient<$Result.GetResult<Prisma.$SalesUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SalesUsers.
     * @param {SalesUserDeleteManyArgs} args - Arguments to filter SalesUsers to delete.
     * @example
     * // Delete a few SalesUsers
     * const { count } = await prisma.salesUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SalesUserDeleteManyArgs>(args?: SelectSubset<T, SalesUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SalesUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SalesUsers
     * const salesUser = await prisma.salesUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SalesUserUpdateManyArgs>(args: SelectSubset<T, SalesUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SalesUser.
     * @param {SalesUserUpsertArgs} args - Arguments to update or create a SalesUser.
     * @example
     * // Update or create a SalesUser
     * const salesUser = await prisma.salesUser.upsert({
     *   create: {
     *     // ... data to create a SalesUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SalesUser we want to update
     *   }
     * })
     */
    upsert<T extends SalesUserUpsertArgs>(args: SelectSubset<T, SalesUserUpsertArgs<ExtArgs>>): Prisma__SalesUserClient<$Result.GetResult<Prisma.$SalesUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SalesUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesUserCountArgs} args - Arguments to filter SalesUsers to count.
     * @example
     * // Count the number of SalesUsers
     * const count = await prisma.salesUser.count({
     *   where: {
     *     // ... the filter for the SalesUsers we want to count
     *   }
     * })
    **/
    count<T extends SalesUserCountArgs>(
      args?: Subset<T, SalesUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SalesUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SalesUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SalesUserAggregateArgs>(args: Subset<T, SalesUserAggregateArgs>): Prisma.PrismaPromise<GetSalesUserAggregateType<T>>

    /**
     * Group by SalesUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SalesUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SalesUserGroupByArgs['orderBy'] }
        : { orderBy?: SalesUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SalesUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalesUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SalesUser model
   */
  readonly fields: SalesUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SalesUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SalesUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SalesUser model
   */
  interface SalesUserFieldRefs {
    readonly id: FieldRef<"SalesUser", 'String'>
    readonly name: FieldRef<"SalesUser", 'String'>
    readonly uniqueId: FieldRef<"SalesUser", 'String'>
    readonly username: FieldRef<"SalesUser", 'String'>
    readonly isActive: FieldRef<"SalesUser", 'Boolean'>
    readonly createdAt: FieldRef<"SalesUser", 'DateTime'>
    readonly updatedAt: FieldRef<"SalesUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SalesUser findUnique
   */
  export type SalesUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
    /**
     * Filter, which SalesUser to fetch.
     */
    where: SalesUserWhereUniqueInput
  }

  /**
   * SalesUser findUniqueOrThrow
   */
  export type SalesUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
    /**
     * Filter, which SalesUser to fetch.
     */
    where: SalesUserWhereUniqueInput
  }

  /**
   * SalesUser findFirst
   */
  export type SalesUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
    /**
     * Filter, which SalesUser to fetch.
     */
    where?: SalesUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesUsers to fetch.
     */
    orderBy?: SalesUserOrderByWithRelationInput | SalesUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesUsers.
     */
    cursor?: SalesUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesUsers.
     */
    distinct?: SalesUserScalarFieldEnum | SalesUserScalarFieldEnum[]
  }

  /**
   * SalesUser findFirstOrThrow
   */
  export type SalesUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
    /**
     * Filter, which SalesUser to fetch.
     */
    where?: SalesUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesUsers to fetch.
     */
    orderBy?: SalesUserOrderByWithRelationInput | SalesUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesUsers.
     */
    cursor?: SalesUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesUsers.
     */
    distinct?: SalesUserScalarFieldEnum | SalesUserScalarFieldEnum[]
  }

  /**
   * SalesUser findMany
   */
  export type SalesUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
    /**
     * Filter, which SalesUsers to fetch.
     */
    where?: SalesUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesUsers to fetch.
     */
    orderBy?: SalesUserOrderByWithRelationInput | SalesUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SalesUsers.
     */
    cursor?: SalesUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesUsers.
     */
    skip?: number
    distinct?: SalesUserScalarFieldEnum | SalesUserScalarFieldEnum[]
  }

  /**
   * SalesUser create
   */
  export type SalesUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
    /**
     * The data needed to create a SalesUser.
     */
    data: XOR<SalesUserCreateInput, SalesUserUncheckedCreateInput>
  }

  /**
   * SalesUser createMany
   */
  export type SalesUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SalesUsers.
     */
    data: SalesUserCreateManyInput | SalesUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SalesUser update
   */
  export type SalesUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
    /**
     * The data needed to update a SalesUser.
     */
    data: XOR<SalesUserUpdateInput, SalesUserUncheckedUpdateInput>
    /**
     * Choose, which SalesUser to update.
     */
    where: SalesUserWhereUniqueInput
  }

  /**
   * SalesUser updateMany
   */
  export type SalesUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SalesUsers.
     */
    data: XOR<SalesUserUpdateManyMutationInput, SalesUserUncheckedUpdateManyInput>
    /**
     * Filter which SalesUsers to update
     */
    where?: SalesUserWhereInput
    /**
     * Limit how many SalesUsers to update.
     */
    limit?: number
  }

  /**
   * SalesUser upsert
   */
  export type SalesUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
    /**
     * The filter to search for the SalesUser to update in case it exists.
     */
    where: SalesUserWhereUniqueInput
    /**
     * In case the SalesUser found by the `where` argument doesn't exist, create a new SalesUser with this data.
     */
    create: XOR<SalesUserCreateInput, SalesUserUncheckedCreateInput>
    /**
     * In case the SalesUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SalesUserUpdateInput, SalesUserUncheckedUpdateInput>
  }

  /**
   * SalesUser delete
   */
  export type SalesUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
    /**
     * Filter which SalesUser to delete.
     */
    where: SalesUserWhereUniqueInput
  }

  /**
   * SalesUser deleteMany
   */
  export type SalesUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesUsers to delete
     */
    where?: SalesUserWhereInput
    /**
     * Limit how many SalesUsers to delete.
     */
    limit?: number
  }

  /**
   * SalesUser without action
   */
  export type SalesUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesUser
     */
    select?: SalesUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesUser
     */
    omit?: SalesUserOmit<ExtArgs> | null
  }


  /**
   * Model UserPermission
   */

  export type AggregateUserPermission = {
    _count: UserPermissionCountAggregateOutputType | null
    _min: UserPermissionMinAggregateOutputType | null
    _max: UserPermissionMaxAggregateOutputType | null
  }

  export type UserPermissionMinAggregateOutputType = {
    id: string | null
    username: string | null
    firstName: string | null
    middleName: string | null
    lastName: string | null
    designation: string | null
    userAccess: string | null
    contactNo: string | null
    accountType: string | null
    password: string | null
    permissions: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserPermissionMaxAggregateOutputType = {
    id: string | null
    username: string | null
    firstName: string | null
    middleName: string | null
    lastName: string | null
    designation: string | null
    userAccess: string | null
    contactNo: string | null
    accountType: string | null
    password: string | null
    permissions: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserPermissionCountAggregateOutputType = {
    id: number
    username: number
    firstName: number
    middleName: number
    lastName: number
    designation: number
    userAccess: number
    contactNo: number
    accountType: number
    password: number
    permissions: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserPermissionMinAggregateInputType = {
    id?: true
    username?: true
    firstName?: true
    middleName?: true
    lastName?: true
    designation?: true
    userAccess?: true
    contactNo?: true
    accountType?: true
    password?: true
    permissions?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserPermissionMaxAggregateInputType = {
    id?: true
    username?: true
    firstName?: true
    middleName?: true
    lastName?: true
    designation?: true
    userAccess?: true
    contactNo?: true
    accountType?: true
    password?: true
    permissions?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserPermissionCountAggregateInputType = {
    id?: true
    username?: true
    firstName?: true
    middleName?: true
    lastName?: true
    designation?: true
    userAccess?: true
    contactNo?: true
    accountType?: true
    password?: true
    permissions?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserPermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPermission to aggregate.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPermissions
    **/
    _count?: true | UserPermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserPermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserPermissionMaxAggregateInputType
  }

  export type GetUserPermissionAggregateType<T extends UserPermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserPermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPermission[P]>
      : GetScalarType<T[P], AggregateUserPermission[P]>
  }




  export type UserPermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPermissionWhereInput
    orderBy?: UserPermissionOrderByWithAggregationInput | UserPermissionOrderByWithAggregationInput[]
    by: UserPermissionScalarFieldEnum[] | UserPermissionScalarFieldEnum
    having?: UserPermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserPermissionCountAggregateInputType | true
    _min?: UserPermissionMinAggregateInputType
    _max?: UserPermissionMaxAggregateInputType
  }

  export type UserPermissionGroupByOutputType = {
    id: string
    username: string
    firstName: string
    middleName: string | null
    lastName: string
    designation: string
    userAccess: string
    contactNo: string | null
    accountType: string
    password: string | null
    permissions: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserPermissionCountAggregateOutputType | null
    _min: UserPermissionMinAggregateOutputType | null
    _max: UserPermissionMaxAggregateOutputType | null
  }

  type GetUserPermissionGroupByPayload<T extends UserPermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserPermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserPermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserPermissionGroupByOutputType[P]>
            : GetScalarType<T[P], UserPermissionGroupByOutputType[P]>
        }
      >
    >


  export type UserPermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    firstName?: boolean
    middleName?: boolean
    lastName?: boolean
    designation?: boolean
    userAccess?: boolean
    contactNo?: boolean
    accountType?: boolean
    password?: boolean
    permissions?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userPermission"]>



  export type UserPermissionSelectScalar = {
    id?: boolean
    username?: boolean
    firstName?: boolean
    middleName?: boolean
    lastName?: boolean
    designation?: boolean
    userAccess?: boolean
    contactNo?: boolean
    accountType?: boolean
    password?: boolean
    permissions?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserPermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "firstName" | "middleName" | "lastName" | "designation" | "userAccess" | "contactNo" | "accountType" | "password" | "permissions" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["userPermission"]>

  export type $UserPermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserPermission"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      firstName: string
      middleName: string | null
      lastName: string
      designation: string
      userAccess: string
      contactNo: string | null
      accountType: string
      password: string | null
      permissions: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userPermission"]>
    composites: {}
  }

  type UserPermissionGetPayload<S extends boolean | null | undefined | UserPermissionDefaultArgs> = $Result.GetResult<Prisma.$UserPermissionPayload, S>

  type UserPermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserPermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserPermissionCountAggregateInputType | true
    }

  export interface UserPermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserPermission'], meta: { name: 'UserPermission' } }
    /**
     * Find zero or one UserPermission that matches the filter.
     * @param {UserPermissionFindUniqueArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPermissionFindUniqueArgs>(args: SelectSubset<T, UserPermissionFindUniqueArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserPermission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserPermissionFindUniqueOrThrowArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserPermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindFirstArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPermissionFindFirstArgs>(args?: SelectSubset<T, UserPermissionFindFirstArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindFirstOrThrowArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserPermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserPermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPermissions
     * const userPermissions = await prisma.userPermission.findMany()
     * 
     * // Get first 10 UserPermissions
     * const userPermissions = await prisma.userPermission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userPermissionWithIdOnly = await prisma.userPermission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserPermissionFindManyArgs>(args?: SelectSubset<T, UserPermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserPermission.
     * @param {UserPermissionCreateArgs} args - Arguments to create a UserPermission.
     * @example
     * // Create one UserPermission
     * const UserPermission = await prisma.userPermission.create({
     *   data: {
     *     // ... data to create a UserPermission
     *   }
     * })
     * 
     */
    create<T extends UserPermissionCreateArgs>(args: SelectSubset<T, UserPermissionCreateArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserPermissions.
     * @param {UserPermissionCreateManyArgs} args - Arguments to create many UserPermissions.
     * @example
     * // Create many UserPermissions
     * const userPermission = await prisma.userPermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserPermissionCreateManyArgs>(args?: SelectSubset<T, UserPermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserPermission.
     * @param {UserPermissionDeleteArgs} args - Arguments to delete one UserPermission.
     * @example
     * // Delete one UserPermission
     * const UserPermission = await prisma.userPermission.delete({
     *   where: {
     *     // ... filter to delete one UserPermission
     *   }
     * })
     * 
     */
    delete<T extends UserPermissionDeleteArgs>(args: SelectSubset<T, UserPermissionDeleteArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserPermission.
     * @param {UserPermissionUpdateArgs} args - Arguments to update one UserPermission.
     * @example
     * // Update one UserPermission
     * const userPermission = await prisma.userPermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserPermissionUpdateArgs>(args: SelectSubset<T, UserPermissionUpdateArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserPermissions.
     * @param {UserPermissionDeleteManyArgs} args - Arguments to filter UserPermissions to delete.
     * @example
     * // Delete a few UserPermissions
     * const { count } = await prisma.userPermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserPermissionDeleteManyArgs>(args?: SelectSubset<T, UserPermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPermissions
     * const userPermission = await prisma.userPermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserPermissionUpdateManyArgs>(args: SelectSubset<T, UserPermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserPermission.
     * @param {UserPermissionUpsertArgs} args - Arguments to update or create a UserPermission.
     * @example
     * // Update or create a UserPermission
     * const userPermission = await prisma.userPermission.upsert({
     *   create: {
     *     // ... data to create a UserPermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPermission we want to update
     *   }
     * })
     */
    upsert<T extends UserPermissionUpsertArgs>(args: SelectSubset<T, UserPermissionUpsertArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionCountArgs} args - Arguments to filter UserPermissions to count.
     * @example
     * // Count the number of UserPermissions
     * const count = await prisma.userPermission.count({
     *   where: {
     *     // ... the filter for the UserPermissions we want to count
     *   }
     * })
    **/
    count<T extends UserPermissionCountArgs>(
      args?: Subset<T, UserPermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserPermissionAggregateArgs>(args: Subset<T, UserPermissionAggregateArgs>): Prisma.PrismaPromise<GetUserPermissionAggregateType<T>>

    /**
     * Group by UserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserPermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPermissionGroupByArgs['orderBy'] }
        : { orderBy?: UserPermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserPermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserPermission model
   */
  readonly fields: UserPermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserPermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserPermission model
   */
  interface UserPermissionFieldRefs {
    readonly id: FieldRef<"UserPermission", 'String'>
    readonly username: FieldRef<"UserPermission", 'String'>
    readonly firstName: FieldRef<"UserPermission", 'String'>
    readonly middleName: FieldRef<"UserPermission", 'String'>
    readonly lastName: FieldRef<"UserPermission", 'String'>
    readonly designation: FieldRef<"UserPermission", 'String'>
    readonly userAccess: FieldRef<"UserPermission", 'String'>
    readonly contactNo: FieldRef<"UserPermission", 'String'>
    readonly accountType: FieldRef<"UserPermission", 'String'>
    readonly password: FieldRef<"UserPermission", 'String'>
    readonly permissions: FieldRef<"UserPermission", 'String'>
    readonly isActive: FieldRef<"UserPermission", 'Boolean'>
    readonly createdAt: FieldRef<"UserPermission", 'DateTime'>
    readonly updatedAt: FieldRef<"UserPermission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserPermission findUnique
   */
  export type UserPermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission findUniqueOrThrow
   */
  export type UserPermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission findFirst
   */
  export type UserPermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * UserPermission findFirstOrThrow
   */
  export type UserPermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * UserPermission findMany
   */
  export type UserPermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Filter, which UserPermissions to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * UserPermission create
   */
  export type UserPermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * The data needed to create a UserPermission.
     */
    data: XOR<UserPermissionCreateInput, UserPermissionUncheckedCreateInput>
  }

  /**
   * UserPermission createMany
   */
  export type UserPermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPermissions.
     */
    data: UserPermissionCreateManyInput | UserPermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserPermission update
   */
  export type UserPermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * The data needed to update a UserPermission.
     */
    data: XOR<UserPermissionUpdateInput, UserPermissionUncheckedUpdateInput>
    /**
     * Choose, which UserPermission to update.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission updateMany
   */
  export type UserPermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPermissions.
     */
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyInput>
    /**
     * Filter which UserPermissions to update
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to update.
     */
    limit?: number
  }

  /**
   * UserPermission upsert
   */
  export type UserPermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * The filter to search for the UserPermission to update in case it exists.
     */
    where: UserPermissionWhereUniqueInput
    /**
     * In case the UserPermission found by the `where` argument doesn't exist, create a new UserPermission with this data.
     */
    create: XOR<UserPermissionCreateInput, UserPermissionUncheckedCreateInput>
    /**
     * In case the UserPermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserPermissionUpdateInput, UserPermissionUncheckedUpdateInput>
  }

  /**
   * UserPermission delete
   */
  export type UserPermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Filter which UserPermission to delete.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission deleteMany
   */
  export type UserPermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPermissions to delete
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to delete.
     */
    limit?: number
  }

  /**
   * UserPermission without action
   */
  export type UserPermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
  }


  /**
   * Model BusinessProfile
   */

  export type AggregateBusinessProfile = {
    _count: BusinessProfileCountAggregateOutputType | null
    _min: BusinessProfileMinAggregateOutputType | null
    _max: BusinessProfileMaxAggregateOutputType | null
  }

  export type BusinessProfileMinAggregateOutputType = {
    id: string | null
    businessName: string | null
    address: string | null
    owner: string | null
    contactPhone: string | null
    contactTel: string | null
    email: string | null
    tin: string | null
    permit: string | null
    logo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BusinessProfileMaxAggregateOutputType = {
    id: string | null
    businessName: string | null
    address: string | null
    owner: string | null
    contactPhone: string | null
    contactTel: string | null
    email: string | null
    tin: string | null
    permit: string | null
    logo: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BusinessProfileCountAggregateOutputType = {
    id: number
    businessName: number
    address: number
    owner: number
    contactPhone: number
    contactTel: number
    email: number
    tin: number
    permit: number
    logo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BusinessProfileMinAggregateInputType = {
    id?: true
    businessName?: true
    address?: true
    owner?: true
    contactPhone?: true
    contactTel?: true
    email?: true
    tin?: true
    permit?: true
    logo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BusinessProfileMaxAggregateInputType = {
    id?: true
    businessName?: true
    address?: true
    owner?: true
    contactPhone?: true
    contactTel?: true
    email?: true
    tin?: true
    permit?: true
    logo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BusinessProfileCountAggregateInputType = {
    id?: true
    businessName?: true
    address?: true
    owner?: true
    contactPhone?: true
    contactTel?: true
    email?: true
    tin?: true
    permit?: true
    logo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BusinessProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BusinessProfile to aggregate.
     */
    where?: BusinessProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BusinessProfiles to fetch.
     */
    orderBy?: BusinessProfileOrderByWithRelationInput | BusinessProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BusinessProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BusinessProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BusinessProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BusinessProfiles
    **/
    _count?: true | BusinessProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BusinessProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BusinessProfileMaxAggregateInputType
  }

  export type GetBusinessProfileAggregateType<T extends BusinessProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateBusinessProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBusinessProfile[P]>
      : GetScalarType<T[P], AggregateBusinessProfile[P]>
  }




  export type BusinessProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessProfileWhereInput
    orderBy?: BusinessProfileOrderByWithAggregationInput | BusinessProfileOrderByWithAggregationInput[]
    by: BusinessProfileScalarFieldEnum[] | BusinessProfileScalarFieldEnum
    having?: BusinessProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BusinessProfileCountAggregateInputType | true
    _min?: BusinessProfileMinAggregateInputType
    _max?: BusinessProfileMaxAggregateInputType
  }

  export type BusinessProfileGroupByOutputType = {
    id: string
    businessName: string
    address: string | null
    owner: string | null
    contactPhone: string | null
    contactTel: string | null
    email: string | null
    tin: string | null
    permit: string | null
    logo: string | null
    createdAt: Date
    updatedAt: Date
    _count: BusinessProfileCountAggregateOutputType | null
    _min: BusinessProfileMinAggregateOutputType | null
    _max: BusinessProfileMaxAggregateOutputType | null
  }

  type GetBusinessProfileGroupByPayload<T extends BusinessProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BusinessProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BusinessProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BusinessProfileGroupByOutputType[P]>
            : GetScalarType<T[P], BusinessProfileGroupByOutputType[P]>
        }
      >
    >


  export type BusinessProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessName?: boolean
    address?: boolean
    owner?: boolean
    contactPhone?: boolean
    contactTel?: boolean
    email?: boolean
    tin?: boolean
    permit?: boolean
    logo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["businessProfile"]>



  export type BusinessProfileSelectScalar = {
    id?: boolean
    businessName?: boolean
    address?: boolean
    owner?: boolean
    contactPhone?: boolean
    contactTel?: boolean
    email?: boolean
    tin?: boolean
    permit?: boolean
    logo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BusinessProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "businessName" | "address" | "owner" | "contactPhone" | "contactTel" | "email" | "tin" | "permit" | "logo" | "createdAt" | "updatedAt", ExtArgs["result"]["businessProfile"]>

  export type $BusinessProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BusinessProfile"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessName: string
      address: string | null
      owner: string | null
      contactPhone: string | null
      contactTel: string | null
      email: string | null
      tin: string | null
      permit: string | null
      logo: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["businessProfile"]>
    composites: {}
  }

  type BusinessProfileGetPayload<S extends boolean | null | undefined | BusinessProfileDefaultArgs> = $Result.GetResult<Prisma.$BusinessProfilePayload, S>

  type BusinessProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BusinessProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BusinessProfileCountAggregateInputType | true
    }

  export interface BusinessProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BusinessProfile'], meta: { name: 'BusinessProfile' } }
    /**
     * Find zero or one BusinessProfile that matches the filter.
     * @param {BusinessProfileFindUniqueArgs} args - Arguments to find a BusinessProfile
     * @example
     * // Get one BusinessProfile
     * const businessProfile = await prisma.businessProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BusinessProfileFindUniqueArgs>(args: SelectSubset<T, BusinessProfileFindUniqueArgs<ExtArgs>>): Prisma__BusinessProfileClient<$Result.GetResult<Prisma.$BusinessProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BusinessProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BusinessProfileFindUniqueOrThrowArgs} args - Arguments to find a BusinessProfile
     * @example
     * // Get one BusinessProfile
     * const businessProfile = await prisma.businessProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BusinessProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, BusinessProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BusinessProfileClient<$Result.GetResult<Prisma.$BusinessProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BusinessProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessProfileFindFirstArgs} args - Arguments to find a BusinessProfile
     * @example
     * // Get one BusinessProfile
     * const businessProfile = await prisma.businessProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BusinessProfileFindFirstArgs>(args?: SelectSubset<T, BusinessProfileFindFirstArgs<ExtArgs>>): Prisma__BusinessProfileClient<$Result.GetResult<Prisma.$BusinessProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BusinessProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessProfileFindFirstOrThrowArgs} args - Arguments to find a BusinessProfile
     * @example
     * // Get one BusinessProfile
     * const businessProfile = await prisma.businessProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BusinessProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, BusinessProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__BusinessProfileClient<$Result.GetResult<Prisma.$BusinessProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BusinessProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BusinessProfiles
     * const businessProfiles = await prisma.businessProfile.findMany()
     * 
     * // Get first 10 BusinessProfiles
     * const businessProfiles = await prisma.businessProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const businessProfileWithIdOnly = await prisma.businessProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BusinessProfileFindManyArgs>(args?: SelectSubset<T, BusinessProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BusinessProfile.
     * @param {BusinessProfileCreateArgs} args - Arguments to create a BusinessProfile.
     * @example
     * // Create one BusinessProfile
     * const BusinessProfile = await prisma.businessProfile.create({
     *   data: {
     *     // ... data to create a BusinessProfile
     *   }
     * })
     * 
     */
    create<T extends BusinessProfileCreateArgs>(args: SelectSubset<T, BusinessProfileCreateArgs<ExtArgs>>): Prisma__BusinessProfileClient<$Result.GetResult<Prisma.$BusinessProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BusinessProfiles.
     * @param {BusinessProfileCreateManyArgs} args - Arguments to create many BusinessProfiles.
     * @example
     * // Create many BusinessProfiles
     * const businessProfile = await prisma.businessProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BusinessProfileCreateManyArgs>(args?: SelectSubset<T, BusinessProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BusinessProfile.
     * @param {BusinessProfileDeleteArgs} args - Arguments to delete one BusinessProfile.
     * @example
     * // Delete one BusinessProfile
     * const BusinessProfile = await prisma.businessProfile.delete({
     *   where: {
     *     // ... filter to delete one BusinessProfile
     *   }
     * })
     * 
     */
    delete<T extends BusinessProfileDeleteArgs>(args: SelectSubset<T, BusinessProfileDeleteArgs<ExtArgs>>): Prisma__BusinessProfileClient<$Result.GetResult<Prisma.$BusinessProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BusinessProfile.
     * @param {BusinessProfileUpdateArgs} args - Arguments to update one BusinessProfile.
     * @example
     * // Update one BusinessProfile
     * const businessProfile = await prisma.businessProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BusinessProfileUpdateArgs>(args: SelectSubset<T, BusinessProfileUpdateArgs<ExtArgs>>): Prisma__BusinessProfileClient<$Result.GetResult<Prisma.$BusinessProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BusinessProfiles.
     * @param {BusinessProfileDeleteManyArgs} args - Arguments to filter BusinessProfiles to delete.
     * @example
     * // Delete a few BusinessProfiles
     * const { count } = await prisma.businessProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BusinessProfileDeleteManyArgs>(args?: SelectSubset<T, BusinessProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BusinessProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BusinessProfiles
     * const businessProfile = await prisma.businessProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BusinessProfileUpdateManyArgs>(args: SelectSubset<T, BusinessProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BusinessProfile.
     * @param {BusinessProfileUpsertArgs} args - Arguments to update or create a BusinessProfile.
     * @example
     * // Update or create a BusinessProfile
     * const businessProfile = await prisma.businessProfile.upsert({
     *   create: {
     *     // ... data to create a BusinessProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BusinessProfile we want to update
     *   }
     * })
     */
    upsert<T extends BusinessProfileUpsertArgs>(args: SelectSubset<T, BusinessProfileUpsertArgs<ExtArgs>>): Prisma__BusinessProfileClient<$Result.GetResult<Prisma.$BusinessProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BusinessProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessProfileCountArgs} args - Arguments to filter BusinessProfiles to count.
     * @example
     * // Count the number of BusinessProfiles
     * const count = await prisma.businessProfile.count({
     *   where: {
     *     // ... the filter for the BusinessProfiles we want to count
     *   }
     * })
    **/
    count<T extends BusinessProfileCountArgs>(
      args?: Subset<T, BusinessProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BusinessProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BusinessProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BusinessProfileAggregateArgs>(args: Subset<T, BusinessProfileAggregateArgs>): Prisma.PrismaPromise<GetBusinessProfileAggregateType<T>>

    /**
     * Group by BusinessProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BusinessProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BusinessProfileGroupByArgs['orderBy'] }
        : { orderBy?: BusinessProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BusinessProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBusinessProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BusinessProfile model
   */
  readonly fields: BusinessProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BusinessProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BusinessProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BusinessProfile model
   */
  interface BusinessProfileFieldRefs {
    readonly id: FieldRef<"BusinessProfile", 'String'>
    readonly businessName: FieldRef<"BusinessProfile", 'String'>
    readonly address: FieldRef<"BusinessProfile", 'String'>
    readonly owner: FieldRef<"BusinessProfile", 'String'>
    readonly contactPhone: FieldRef<"BusinessProfile", 'String'>
    readonly contactTel: FieldRef<"BusinessProfile", 'String'>
    readonly email: FieldRef<"BusinessProfile", 'String'>
    readonly tin: FieldRef<"BusinessProfile", 'String'>
    readonly permit: FieldRef<"BusinessProfile", 'String'>
    readonly logo: FieldRef<"BusinessProfile", 'String'>
    readonly createdAt: FieldRef<"BusinessProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"BusinessProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BusinessProfile findUnique
   */
  export type BusinessProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
    /**
     * Filter, which BusinessProfile to fetch.
     */
    where: BusinessProfileWhereUniqueInput
  }

  /**
   * BusinessProfile findUniqueOrThrow
   */
  export type BusinessProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
    /**
     * Filter, which BusinessProfile to fetch.
     */
    where: BusinessProfileWhereUniqueInput
  }

  /**
   * BusinessProfile findFirst
   */
  export type BusinessProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
    /**
     * Filter, which BusinessProfile to fetch.
     */
    where?: BusinessProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BusinessProfiles to fetch.
     */
    orderBy?: BusinessProfileOrderByWithRelationInput | BusinessProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BusinessProfiles.
     */
    cursor?: BusinessProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BusinessProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BusinessProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BusinessProfiles.
     */
    distinct?: BusinessProfileScalarFieldEnum | BusinessProfileScalarFieldEnum[]
  }

  /**
   * BusinessProfile findFirstOrThrow
   */
  export type BusinessProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
    /**
     * Filter, which BusinessProfile to fetch.
     */
    where?: BusinessProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BusinessProfiles to fetch.
     */
    orderBy?: BusinessProfileOrderByWithRelationInput | BusinessProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BusinessProfiles.
     */
    cursor?: BusinessProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BusinessProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BusinessProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BusinessProfiles.
     */
    distinct?: BusinessProfileScalarFieldEnum | BusinessProfileScalarFieldEnum[]
  }

  /**
   * BusinessProfile findMany
   */
  export type BusinessProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
    /**
     * Filter, which BusinessProfiles to fetch.
     */
    where?: BusinessProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BusinessProfiles to fetch.
     */
    orderBy?: BusinessProfileOrderByWithRelationInput | BusinessProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BusinessProfiles.
     */
    cursor?: BusinessProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BusinessProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BusinessProfiles.
     */
    skip?: number
    distinct?: BusinessProfileScalarFieldEnum | BusinessProfileScalarFieldEnum[]
  }

  /**
   * BusinessProfile create
   */
  export type BusinessProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
    /**
     * The data needed to create a BusinessProfile.
     */
    data: XOR<BusinessProfileCreateInput, BusinessProfileUncheckedCreateInput>
  }

  /**
   * BusinessProfile createMany
   */
  export type BusinessProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BusinessProfiles.
     */
    data: BusinessProfileCreateManyInput | BusinessProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BusinessProfile update
   */
  export type BusinessProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
    /**
     * The data needed to update a BusinessProfile.
     */
    data: XOR<BusinessProfileUpdateInput, BusinessProfileUncheckedUpdateInput>
    /**
     * Choose, which BusinessProfile to update.
     */
    where: BusinessProfileWhereUniqueInput
  }

  /**
   * BusinessProfile updateMany
   */
  export type BusinessProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BusinessProfiles.
     */
    data: XOR<BusinessProfileUpdateManyMutationInput, BusinessProfileUncheckedUpdateManyInput>
    /**
     * Filter which BusinessProfiles to update
     */
    where?: BusinessProfileWhereInput
    /**
     * Limit how many BusinessProfiles to update.
     */
    limit?: number
  }

  /**
   * BusinessProfile upsert
   */
  export type BusinessProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
    /**
     * The filter to search for the BusinessProfile to update in case it exists.
     */
    where: BusinessProfileWhereUniqueInput
    /**
     * In case the BusinessProfile found by the `where` argument doesn't exist, create a new BusinessProfile with this data.
     */
    create: XOR<BusinessProfileCreateInput, BusinessProfileUncheckedCreateInput>
    /**
     * In case the BusinessProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BusinessProfileUpdateInput, BusinessProfileUncheckedUpdateInput>
  }

  /**
   * BusinessProfile delete
   */
  export type BusinessProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
    /**
     * Filter which BusinessProfile to delete.
     */
    where: BusinessProfileWhereUniqueInput
  }

  /**
   * BusinessProfile deleteMany
   */
  export type BusinessProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BusinessProfiles to delete
     */
    where?: BusinessProfileWhereInput
    /**
     * Limit how many BusinessProfiles to delete.
     */
    limit?: number
  }

  /**
   * BusinessProfile without action
   */
  export type BusinessProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessProfile
     */
    select?: BusinessProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BusinessProfile
     */
    omit?: BusinessProfileOmit<ExtArgs> | null
  }


  /**
   * Model BackupSchedule
   */

  export type AggregateBackupSchedule = {
    _count: BackupScheduleCountAggregateOutputType | null
    _min: BackupScheduleMinAggregateOutputType | null
    _max: BackupScheduleMaxAggregateOutputType | null
  }

  export type BackupScheduleMinAggregateOutputType = {
    id: string | null
    backupTime: Date | null
    frequency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BackupScheduleMaxAggregateOutputType = {
    id: string | null
    backupTime: Date | null
    frequency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BackupScheduleCountAggregateOutputType = {
    id: number
    backupTime: number
    frequency: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BackupScheduleMinAggregateInputType = {
    id?: true
    backupTime?: true
    frequency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BackupScheduleMaxAggregateInputType = {
    id?: true
    backupTime?: true
    frequency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BackupScheduleCountAggregateInputType = {
    id?: true
    backupTime?: true
    frequency?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BackupScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupSchedule to aggregate.
     */
    where?: BackupScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupSchedules to fetch.
     */
    orderBy?: BackupScheduleOrderByWithRelationInput | BackupScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackupScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BackupSchedules
    **/
    _count?: true | BackupScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackupScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackupScheduleMaxAggregateInputType
  }

  export type GetBackupScheduleAggregateType<T extends BackupScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateBackupSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackupSchedule[P]>
      : GetScalarType<T[P], AggregateBackupSchedule[P]>
  }




  export type BackupScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupScheduleWhereInput
    orderBy?: BackupScheduleOrderByWithAggregationInput | BackupScheduleOrderByWithAggregationInput[]
    by: BackupScheduleScalarFieldEnum[] | BackupScheduleScalarFieldEnum
    having?: BackupScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackupScheduleCountAggregateInputType | true
    _min?: BackupScheduleMinAggregateInputType
    _max?: BackupScheduleMaxAggregateInputType
  }

  export type BackupScheduleGroupByOutputType = {
    id: string
    backupTime: Date
    frequency: string
    createdAt: Date
    updatedAt: Date
    _count: BackupScheduleCountAggregateOutputType | null
    _min: BackupScheduleMinAggregateOutputType | null
    _max: BackupScheduleMaxAggregateOutputType | null
  }

  type GetBackupScheduleGroupByPayload<T extends BackupScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackupScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackupScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackupScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], BackupScheduleGroupByOutputType[P]>
        }
      >
    >


  export type BackupScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    backupTime?: boolean
    frequency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backupSchedule"]>



  export type BackupScheduleSelectScalar = {
    id?: boolean
    backupTime?: boolean
    frequency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BackupScheduleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "backupTime" | "frequency" | "createdAt" | "updatedAt", ExtArgs["result"]["backupSchedule"]>

  export type $BackupSchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BackupSchedule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      backupTime: Date
      frequency: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["backupSchedule"]>
    composites: {}
  }

  type BackupScheduleGetPayload<S extends boolean | null | undefined | BackupScheduleDefaultArgs> = $Result.GetResult<Prisma.$BackupSchedulePayload, S>

  type BackupScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BackupScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BackupScheduleCountAggregateInputType | true
    }

  export interface BackupScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BackupSchedule'], meta: { name: 'BackupSchedule' } }
    /**
     * Find zero or one BackupSchedule that matches the filter.
     * @param {BackupScheduleFindUniqueArgs} args - Arguments to find a BackupSchedule
     * @example
     * // Get one BackupSchedule
     * const backupSchedule = await prisma.backupSchedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackupScheduleFindUniqueArgs>(args: SelectSubset<T, BackupScheduleFindUniqueArgs<ExtArgs>>): Prisma__BackupScheduleClient<$Result.GetResult<Prisma.$BackupSchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BackupSchedule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BackupScheduleFindUniqueOrThrowArgs} args - Arguments to find a BackupSchedule
     * @example
     * // Get one BackupSchedule
     * const backupSchedule = await prisma.backupSchedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackupScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, BackupScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackupScheduleClient<$Result.GetResult<Prisma.$BackupSchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupSchedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupScheduleFindFirstArgs} args - Arguments to find a BackupSchedule
     * @example
     * // Get one BackupSchedule
     * const backupSchedule = await prisma.backupSchedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackupScheduleFindFirstArgs>(args?: SelectSubset<T, BackupScheduleFindFirstArgs<ExtArgs>>): Prisma__BackupScheduleClient<$Result.GetResult<Prisma.$BackupSchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BackupSchedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupScheduleFindFirstOrThrowArgs} args - Arguments to find a BackupSchedule
     * @example
     * // Get one BackupSchedule
     * const backupSchedule = await prisma.backupSchedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackupScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, BackupScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackupScheduleClient<$Result.GetResult<Prisma.$BackupSchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BackupSchedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BackupSchedules
     * const backupSchedules = await prisma.backupSchedule.findMany()
     * 
     * // Get first 10 BackupSchedules
     * const backupSchedules = await prisma.backupSchedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const backupScheduleWithIdOnly = await prisma.backupSchedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BackupScheduleFindManyArgs>(args?: SelectSubset<T, BackupScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BackupSchedule.
     * @param {BackupScheduleCreateArgs} args - Arguments to create a BackupSchedule.
     * @example
     * // Create one BackupSchedule
     * const BackupSchedule = await prisma.backupSchedule.create({
     *   data: {
     *     // ... data to create a BackupSchedule
     *   }
     * })
     * 
     */
    create<T extends BackupScheduleCreateArgs>(args: SelectSubset<T, BackupScheduleCreateArgs<ExtArgs>>): Prisma__BackupScheduleClient<$Result.GetResult<Prisma.$BackupSchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BackupSchedules.
     * @param {BackupScheduleCreateManyArgs} args - Arguments to create many BackupSchedules.
     * @example
     * // Create many BackupSchedules
     * const backupSchedule = await prisma.backupSchedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackupScheduleCreateManyArgs>(args?: SelectSubset<T, BackupScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BackupSchedule.
     * @param {BackupScheduleDeleteArgs} args - Arguments to delete one BackupSchedule.
     * @example
     * // Delete one BackupSchedule
     * const BackupSchedule = await prisma.backupSchedule.delete({
     *   where: {
     *     // ... filter to delete one BackupSchedule
     *   }
     * })
     * 
     */
    delete<T extends BackupScheduleDeleteArgs>(args: SelectSubset<T, BackupScheduleDeleteArgs<ExtArgs>>): Prisma__BackupScheduleClient<$Result.GetResult<Prisma.$BackupSchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BackupSchedule.
     * @param {BackupScheduleUpdateArgs} args - Arguments to update one BackupSchedule.
     * @example
     * // Update one BackupSchedule
     * const backupSchedule = await prisma.backupSchedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackupScheduleUpdateArgs>(args: SelectSubset<T, BackupScheduleUpdateArgs<ExtArgs>>): Prisma__BackupScheduleClient<$Result.GetResult<Prisma.$BackupSchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BackupSchedules.
     * @param {BackupScheduleDeleteManyArgs} args - Arguments to filter BackupSchedules to delete.
     * @example
     * // Delete a few BackupSchedules
     * const { count } = await prisma.backupSchedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackupScheduleDeleteManyArgs>(args?: SelectSubset<T, BackupScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackupSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BackupSchedules
     * const backupSchedule = await prisma.backupSchedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackupScheduleUpdateManyArgs>(args: SelectSubset<T, BackupScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BackupSchedule.
     * @param {BackupScheduleUpsertArgs} args - Arguments to update or create a BackupSchedule.
     * @example
     * // Update or create a BackupSchedule
     * const backupSchedule = await prisma.backupSchedule.upsert({
     *   create: {
     *     // ... data to create a BackupSchedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BackupSchedule we want to update
     *   }
     * })
     */
    upsert<T extends BackupScheduleUpsertArgs>(args: SelectSubset<T, BackupScheduleUpsertArgs<ExtArgs>>): Prisma__BackupScheduleClient<$Result.GetResult<Prisma.$BackupSchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BackupSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupScheduleCountArgs} args - Arguments to filter BackupSchedules to count.
     * @example
     * // Count the number of BackupSchedules
     * const count = await prisma.backupSchedule.count({
     *   where: {
     *     // ... the filter for the BackupSchedules we want to count
     *   }
     * })
    **/
    count<T extends BackupScheduleCountArgs>(
      args?: Subset<T, BackupScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackupScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BackupSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BackupScheduleAggregateArgs>(args: Subset<T, BackupScheduleAggregateArgs>): Prisma.PrismaPromise<GetBackupScheduleAggregateType<T>>

    /**
     * Group by BackupSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BackupScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackupScheduleGroupByArgs['orderBy'] }
        : { orderBy?: BackupScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BackupScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackupScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BackupSchedule model
   */
  readonly fields: BackupScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BackupSchedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackupScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BackupSchedule model
   */
  interface BackupScheduleFieldRefs {
    readonly id: FieldRef<"BackupSchedule", 'String'>
    readonly backupTime: FieldRef<"BackupSchedule", 'DateTime'>
    readonly frequency: FieldRef<"BackupSchedule", 'String'>
    readonly createdAt: FieldRef<"BackupSchedule", 'DateTime'>
    readonly updatedAt: FieldRef<"BackupSchedule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BackupSchedule findUnique
   */
  export type BackupScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
    /**
     * Filter, which BackupSchedule to fetch.
     */
    where: BackupScheduleWhereUniqueInput
  }

  /**
   * BackupSchedule findUniqueOrThrow
   */
  export type BackupScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
    /**
     * Filter, which BackupSchedule to fetch.
     */
    where: BackupScheduleWhereUniqueInput
  }

  /**
   * BackupSchedule findFirst
   */
  export type BackupScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
    /**
     * Filter, which BackupSchedule to fetch.
     */
    where?: BackupScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupSchedules to fetch.
     */
    orderBy?: BackupScheduleOrderByWithRelationInput | BackupScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupSchedules.
     */
    cursor?: BackupScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupSchedules.
     */
    distinct?: BackupScheduleScalarFieldEnum | BackupScheduleScalarFieldEnum[]
  }

  /**
   * BackupSchedule findFirstOrThrow
   */
  export type BackupScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
    /**
     * Filter, which BackupSchedule to fetch.
     */
    where?: BackupScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupSchedules to fetch.
     */
    orderBy?: BackupScheduleOrderByWithRelationInput | BackupScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackupSchedules.
     */
    cursor?: BackupScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackupSchedules.
     */
    distinct?: BackupScheduleScalarFieldEnum | BackupScheduleScalarFieldEnum[]
  }

  /**
   * BackupSchedule findMany
   */
  export type BackupScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
    /**
     * Filter, which BackupSchedules to fetch.
     */
    where?: BackupScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackupSchedules to fetch.
     */
    orderBy?: BackupScheduleOrderByWithRelationInput | BackupScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BackupSchedules.
     */
    cursor?: BackupScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackupSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackupSchedules.
     */
    skip?: number
    distinct?: BackupScheduleScalarFieldEnum | BackupScheduleScalarFieldEnum[]
  }

  /**
   * BackupSchedule create
   */
  export type BackupScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
    /**
     * The data needed to create a BackupSchedule.
     */
    data: XOR<BackupScheduleCreateInput, BackupScheduleUncheckedCreateInput>
  }

  /**
   * BackupSchedule createMany
   */
  export type BackupScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BackupSchedules.
     */
    data: BackupScheduleCreateManyInput | BackupScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BackupSchedule update
   */
  export type BackupScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
    /**
     * The data needed to update a BackupSchedule.
     */
    data: XOR<BackupScheduleUpdateInput, BackupScheduleUncheckedUpdateInput>
    /**
     * Choose, which BackupSchedule to update.
     */
    where: BackupScheduleWhereUniqueInput
  }

  /**
   * BackupSchedule updateMany
   */
  export type BackupScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BackupSchedules.
     */
    data: XOR<BackupScheduleUpdateManyMutationInput, BackupScheduleUncheckedUpdateManyInput>
    /**
     * Filter which BackupSchedules to update
     */
    where?: BackupScheduleWhereInput
    /**
     * Limit how many BackupSchedules to update.
     */
    limit?: number
  }

  /**
   * BackupSchedule upsert
   */
  export type BackupScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
    /**
     * The filter to search for the BackupSchedule to update in case it exists.
     */
    where: BackupScheduleWhereUniqueInput
    /**
     * In case the BackupSchedule found by the `where` argument doesn't exist, create a new BackupSchedule with this data.
     */
    create: XOR<BackupScheduleCreateInput, BackupScheduleUncheckedCreateInput>
    /**
     * In case the BackupSchedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackupScheduleUpdateInput, BackupScheduleUncheckedUpdateInput>
  }

  /**
   * BackupSchedule delete
   */
  export type BackupScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
    /**
     * Filter which BackupSchedule to delete.
     */
    where: BackupScheduleWhereUniqueInput
  }

  /**
   * BackupSchedule deleteMany
   */
  export type BackupScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackupSchedules to delete
     */
    where?: BackupScheduleWhereInput
    /**
     * Limit how many BackupSchedules to delete.
     */
    limit?: number
  }

  /**
   * BackupSchedule without action
   */
  export type BackupScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackupSchedule
     */
    select?: BackupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BackupSchedule
     */
    omit?: BackupScheduleOmit<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    type: string | null
    title: string | null
    message: string | null
    entityId: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    type: string | null
    title: string | null
    message: string | null
    entityId: string | null
    isRead: boolean | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    type: number
    title: number
    message: number
    entityId: number
    isRead: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    type?: true
    title?: true
    message?: true
    entityId?: true
    isRead?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    type?: true
    title?: true
    message?: true
    entityId?: true
    isRead?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    type?: true
    title?: true
    message?: true
    entityId?: true
    isRead?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    type: string
    title: string
    message: string | null
    entityId: string | null
    isRead: boolean
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    entityId?: boolean
    isRead?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["notification"]>



  export type NotificationSelectScalar = {
    id?: boolean
    type?: boolean
    title?: boolean
    message?: boolean
    entityId?: boolean
    isRead?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "title" | "message" | "entityId" | "isRead" | "createdAt", ExtArgs["result"]["notification"]>

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      title: string
      message: string | null
      entityId: string | null
      isRead: boolean
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly entityId: FieldRef<"Notification", 'String'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accnt_no: 'accnt_no',
    accnt_type_no: 'accnt_type_no',
    name: 'name',
    balance: 'balance',
    type: 'type',
    header: 'header',
    bank: 'bank',
    category: 'category',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    seq: 'seq',
    ledger: 'ledger',
    transNo: 'transNo',
    code: 'code',
    accountNumber: 'accountNumber',
    date: 'date',
    invoiceNumber: 'invoiceNumber',
    particulars: 'particulars',
    debit: 'debit',
    credit: 'credit',
    balance: 'balance',
    checkAccountNumber: 'checkAccountNumber',
    checkNumber: 'checkNumber',
    dateMatured: 'dateMatured',
    accountName: 'accountName',
    bankName: 'bankName',
    bankBranch: 'bankBranch',
    user: 'user',
    isCoincide: 'isCoincide',
    dailyClosing: 'dailyClosing',
    approval: 'approval',
    ftToLedger: 'ftToLedger',
    ftToAccount: 'ftToAccount',
    ssma_timestamp: 'ssma_timestamp',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const LoyaltyPointSettingScalarFieldEnum: {
    id: 'id',
    description: 'description',
    amount: 'amount',
    equivalentPoint: 'equivalentPoint',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LoyaltyPointSettingScalarFieldEnum = (typeof LoyaltyPointSettingScalarFieldEnum)[keyof typeof LoyaltyPointSettingScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    code: 'code',
    customerName: 'customerName',
    contactFirstName: 'contactFirstName',
    address: 'address',
    phonePrimary: 'phonePrimary',
    phoneAlternative: 'phoneAlternative',
    email: 'email',
    isActive: 'isActive',
    creditLimit: 'creditLimit',
    isTaxExempt: 'isTaxExempt',
    paymentTerms: 'paymentTerms',
    paymentTermsValue: 'paymentTermsValue',
    salesperson: 'salesperson',
    customerGroup: 'customerGroup',
    isEntitledToLoyaltyPoints: 'isEntitledToLoyaltyPoints',
    pointSetting: 'pointSetting',
    loyaltyCalculationMethod: 'loyaltyCalculationMethod',
    loyaltyCardNumber: 'loyaltyCardNumber',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const LoyaltyPointScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    loyaltyCardId: 'loyaltyCardId',
    totalPoints: 'totalPoints',
    pointSettingId: 'pointSettingId',
    expiryDate: 'expiryDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LoyaltyPointScalarFieldEnum = (typeof LoyaltyPointScalarFieldEnum)[keyof typeof LoyaltyPointScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    barcode: 'barcode',
    description: 'description',
    additionalDescription: 'additionalDescription',
    category: 'category',
    categoryId: 'categoryId',
    subcategoryId: 'subcategoryId',
    brandId: 'brandId',
    supplierId: 'supplierId',
    unitOfMeasureId: 'unitOfMeasureId',
    unitPrice: 'unitPrice',
    costPrice: 'costPrice',
    stockQuantity: 'stockQuantity',
    minStockLevel: 'minStockLevel',
    maxStockLevel: 'maxStockLevel',
    isActive: 'isActive',
    salesOrder: 'salesOrder',
    autoCreateChildren: 'autoCreateChildren',
    initialStock: 'initialStock',
    reorderPoint: 'reorderPoint',
    incomeAccountId: 'incomeAccountId',
    expenseAccountId: 'expenseAccountId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ConversionFactorScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    unitName: 'unitName',
    factor: 'factor',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConversionFactorScalarFieldEnum = (typeof ConversionFactorScalarFieldEnum)[keyof typeof ConversionFactorScalarFieldEnum]


  export const BrandScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BrandScalarFieldEnum = (typeof BrandScalarFieldEnum)[keyof typeof BrandScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    parentCategoryId: 'parentCategoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const SupplierScalarFieldEnum: {
    id: 'id',
    name: 'name',
    contactPerson: 'contactPerson',
    email: 'email',
    phone: 'phone',
    address: 'address',
    paymentTerms: 'paymentTerms',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupplierScalarFieldEnum = (typeof SupplierScalarFieldEnum)[keyof typeof SupplierScalarFieldEnum]


  export const UnitOfMeasureScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UnitOfMeasureScalarFieldEnum = (typeof UnitOfMeasureScalarFieldEnum)[keyof typeof UnitOfMeasureScalarFieldEnum]


  export const ReminderScalarFieldEnum: {
    id: 'id',
    title: 'title',
    memo: 'memo',
    date: 'date',
    endDate: 'endDate',
    isActive: 'isActive',
    isRead: 'isRead',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReminderScalarFieldEnum = (typeof ReminderScalarFieldEnum)[keyof typeof ReminderScalarFieldEnum]


  export const SalesUserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    uniqueId: 'uniqueId',
    username: 'username',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SalesUserScalarFieldEnum = (typeof SalesUserScalarFieldEnum)[keyof typeof SalesUserScalarFieldEnum]


  export const UserPermissionScalarFieldEnum: {
    id: 'id',
    username: 'username',
    firstName: 'firstName',
    middleName: 'middleName',
    lastName: 'lastName',
    designation: 'designation',
    userAccess: 'userAccess',
    contactNo: 'contactNo',
    accountType: 'accountType',
    password: 'password',
    permissions: 'permissions',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserPermissionScalarFieldEnum = (typeof UserPermissionScalarFieldEnum)[keyof typeof UserPermissionScalarFieldEnum]


  export const BusinessProfileScalarFieldEnum: {
    id: 'id',
    businessName: 'businessName',
    address: 'address',
    owner: 'owner',
    contactPhone: 'contactPhone',
    contactTel: 'contactTel',
    email: 'email',
    tin: 'tin',
    permit: 'permit',
    logo: 'logo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BusinessProfileScalarFieldEnum = (typeof BusinessProfileScalarFieldEnum)[keyof typeof BusinessProfileScalarFieldEnum]


  export const BackupScheduleScalarFieldEnum: {
    id: 'id',
    backupTime: 'backupTime',
    frequency: 'frequency',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BackupScheduleScalarFieldEnum = (typeof BackupScheduleScalarFieldEnum)[keyof typeof BackupScheduleScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    type: 'type',
    title: 'title',
    message: 'message',
    entityId: 'entityId',
    isRead: 'isRead',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const AccountOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    header: 'header',
    bank: 'bank',
    category: 'category'
  };

  export type AccountOrderByRelevanceFieldEnum = (typeof AccountOrderByRelevanceFieldEnum)[keyof typeof AccountOrderByRelevanceFieldEnum]


  export const TransactionOrderByRelevanceFieldEnum: {
    id: 'id',
    ledger: 'ledger',
    transNo: 'transNo',
    code: 'code',
    accountNumber: 'accountNumber',
    invoiceNumber: 'invoiceNumber',
    particulars: 'particulars',
    checkAccountNumber: 'checkAccountNumber',
    checkNumber: 'checkNumber',
    accountName: 'accountName',
    bankName: 'bankName',
    bankBranch: 'bankBranch',
    user: 'user',
    approval: 'approval',
    ftToLedger: 'ftToLedger',
    ftToAccount: 'ftToAccount'
  };

  export type TransactionOrderByRelevanceFieldEnum = (typeof TransactionOrderByRelevanceFieldEnum)[keyof typeof TransactionOrderByRelevanceFieldEnum]


  export const LoyaltyPointSettingOrderByRelevanceFieldEnum: {
    id: 'id',
    description: 'description'
  };

  export type LoyaltyPointSettingOrderByRelevanceFieldEnum = (typeof LoyaltyPointSettingOrderByRelevanceFieldEnum)[keyof typeof LoyaltyPointSettingOrderByRelevanceFieldEnum]


  export const CustomerOrderByRelevanceFieldEnum: {
    id: 'id',
    code: 'code',
    customerName: 'customerName',
    contactFirstName: 'contactFirstName',
    address: 'address',
    phonePrimary: 'phonePrimary',
    phoneAlternative: 'phoneAlternative',
    email: 'email',
    paymentTerms: 'paymentTerms',
    paymentTermsValue: 'paymentTermsValue',
    salesperson: 'salesperson',
    customerGroup: 'customerGroup',
    pointSetting: 'pointSetting',
    loyaltyCalculationMethod: 'loyaltyCalculationMethod',
    loyaltyCardNumber: 'loyaltyCardNumber'
  };

  export type CustomerOrderByRelevanceFieldEnum = (typeof CustomerOrderByRelevanceFieldEnum)[keyof typeof CustomerOrderByRelevanceFieldEnum]


  export const LoyaltyPointOrderByRelevanceFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    loyaltyCardId: 'loyaltyCardId',
    pointSettingId: 'pointSettingId'
  };

  export type LoyaltyPointOrderByRelevanceFieldEnum = (typeof LoyaltyPointOrderByRelevanceFieldEnum)[keyof typeof LoyaltyPointOrderByRelevanceFieldEnum]


  export const ProductOrderByRelevanceFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    barcode: 'barcode',
    description: 'description',
    additionalDescription: 'additionalDescription',
    category: 'category',
    categoryId: 'categoryId',
    subcategoryId: 'subcategoryId',
    brandId: 'brandId',
    supplierId: 'supplierId',
    unitOfMeasureId: 'unitOfMeasureId',
    salesOrder: 'salesOrder',
    incomeAccountId: 'incomeAccountId',
    expenseAccountId: 'expenseAccountId'
  };

  export type ProductOrderByRelevanceFieldEnum = (typeof ProductOrderByRelevanceFieldEnum)[keyof typeof ProductOrderByRelevanceFieldEnum]


  export const ConversionFactorOrderByRelevanceFieldEnum: {
    id: 'id',
    productId: 'productId',
    unitName: 'unitName'
  };

  export type ConversionFactorOrderByRelevanceFieldEnum = (typeof ConversionFactorOrderByRelevanceFieldEnum)[keyof typeof ConversionFactorOrderByRelevanceFieldEnum]


  export const BrandOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description'
  };

  export type BrandOrderByRelevanceFieldEnum = (typeof BrandOrderByRelevanceFieldEnum)[keyof typeof BrandOrderByRelevanceFieldEnum]


  export const CategoryOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    parentCategoryId: 'parentCategoryId'
  };

  export type CategoryOrderByRelevanceFieldEnum = (typeof CategoryOrderByRelevanceFieldEnum)[keyof typeof CategoryOrderByRelevanceFieldEnum]


  export const SupplierOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    contactPerson: 'contactPerson',
    email: 'email',
    phone: 'phone',
    address: 'address',
    paymentTerms: 'paymentTerms'
  };

  export type SupplierOrderByRelevanceFieldEnum = (typeof SupplierOrderByRelevanceFieldEnum)[keyof typeof SupplierOrderByRelevanceFieldEnum]


  export const UnitOfMeasureOrderByRelevanceFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description'
  };

  export type UnitOfMeasureOrderByRelevanceFieldEnum = (typeof UnitOfMeasureOrderByRelevanceFieldEnum)[keyof typeof UnitOfMeasureOrderByRelevanceFieldEnum]


  export const ReminderOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    memo: 'memo'
  };

  export type ReminderOrderByRelevanceFieldEnum = (typeof ReminderOrderByRelevanceFieldEnum)[keyof typeof ReminderOrderByRelevanceFieldEnum]


  export const SalesUserOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    uniqueId: 'uniqueId',
    username: 'username'
  };

  export type SalesUserOrderByRelevanceFieldEnum = (typeof SalesUserOrderByRelevanceFieldEnum)[keyof typeof SalesUserOrderByRelevanceFieldEnum]


  export const UserPermissionOrderByRelevanceFieldEnum: {
    id: 'id',
    username: 'username',
    firstName: 'firstName',
    middleName: 'middleName',
    lastName: 'lastName',
    designation: 'designation',
    userAccess: 'userAccess',
    contactNo: 'contactNo',
    accountType: 'accountType',
    password: 'password',
    permissions: 'permissions'
  };

  export type UserPermissionOrderByRelevanceFieldEnum = (typeof UserPermissionOrderByRelevanceFieldEnum)[keyof typeof UserPermissionOrderByRelevanceFieldEnum]


  export const BusinessProfileOrderByRelevanceFieldEnum: {
    id: 'id',
    businessName: 'businessName',
    address: 'address',
    owner: 'owner',
    contactPhone: 'contactPhone',
    contactTel: 'contactTel',
    email: 'email',
    tin: 'tin',
    permit: 'permit',
    logo: 'logo'
  };

  export type BusinessProfileOrderByRelevanceFieldEnum = (typeof BusinessProfileOrderByRelevanceFieldEnum)[keyof typeof BusinessProfileOrderByRelevanceFieldEnum]


  export const BackupScheduleOrderByRelevanceFieldEnum: {
    id: 'id',
    frequency: 'frequency'
  };

  export type BackupScheduleOrderByRelevanceFieldEnum = (typeof BackupScheduleOrderByRelevanceFieldEnum)[keyof typeof BackupScheduleOrderByRelevanceFieldEnum]


  export const NotificationOrderByRelevanceFieldEnum: {
    id: 'id',
    type: 'type',
    title: 'title',
    message: 'message',
    entityId: 'entityId'
  };

  export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accnt_no?: IntFilter<"Account"> | number
    accnt_type_no?: IntFilter<"Account"> | number
    name?: StringFilter<"Account"> | string
    balance?: FloatNullableFilter<"Account"> | number | null
    type?: StringFilter<"Account"> | string
    header?: StringFilter<"Account"> | string
    bank?: StringFilter<"Account"> | string
    category?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accnt_no?: SortOrder
    accnt_type_no?: SortOrder
    name?: SortOrder
    balance?: SortOrderInput | SortOrder
    type?: SortOrder
    header?: SortOrder
    bank?: SortOrder
    category?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: AccountOrderByRelevanceInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accnt_no?: number
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accnt_type_no?: IntFilter<"Account"> | number
    name?: StringFilter<"Account"> | string
    balance?: FloatNullableFilter<"Account"> | number | null
    type?: StringFilter<"Account"> | string
    header?: StringFilter<"Account"> | string
    bank?: StringFilter<"Account"> | string
    category?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }, "id" | "accnt_no">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accnt_no?: SortOrder
    accnt_type_no?: SortOrder
    name?: SortOrder
    balance?: SortOrderInput | SortOrder
    type?: SortOrder
    header?: SortOrder
    bank?: SortOrder
    category?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accnt_no?: IntWithAggregatesFilter<"Account"> | number
    accnt_type_no?: IntWithAggregatesFilter<"Account"> | number
    name?: StringWithAggregatesFilter<"Account"> | string
    balance?: FloatNullableWithAggregatesFilter<"Account"> | number | null
    type?: StringWithAggregatesFilter<"Account"> | string
    header?: StringWithAggregatesFilter<"Account"> | string
    bank?: StringWithAggregatesFilter<"Account"> | string
    category?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    seq?: IntNullableFilter<"Transaction"> | number | null
    ledger?: StringNullableFilter<"Transaction"> | string | null
    transNo?: StringNullableFilter<"Transaction"> | string | null
    code?: StringNullableFilter<"Transaction"> | string | null
    accountNumber?: StringNullableFilter<"Transaction"> | string | null
    date?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    invoiceNumber?: StringNullableFilter<"Transaction"> | string | null
    particulars?: StringNullableFilter<"Transaction"> | string | null
    debit?: FloatNullableFilter<"Transaction"> | number | null
    credit?: FloatNullableFilter<"Transaction"> | number | null
    balance?: FloatNullableFilter<"Transaction"> | number | null
    checkAccountNumber?: StringNullableFilter<"Transaction"> | string | null
    checkNumber?: StringNullableFilter<"Transaction"> | string | null
    dateMatured?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    accountName?: StringNullableFilter<"Transaction"> | string | null
    bankName?: StringNullableFilter<"Transaction"> | string | null
    bankBranch?: StringNullableFilter<"Transaction"> | string | null
    user?: StringNullableFilter<"Transaction"> | string | null
    isCoincide?: BoolNullableFilter<"Transaction"> | boolean | null
    dailyClosing?: IntNullableFilter<"Transaction"> | number | null
    approval?: StringNullableFilter<"Transaction"> | string | null
    ftToLedger?: StringNullableFilter<"Transaction"> | string | null
    ftToAccount?: StringNullableFilter<"Transaction"> | string | null
    ssma_timestamp?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    seq?: SortOrderInput | SortOrder
    ledger?: SortOrderInput | SortOrder
    transNo?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    accountNumber?: SortOrderInput | SortOrder
    date?: SortOrderInput | SortOrder
    invoiceNumber?: SortOrderInput | SortOrder
    particulars?: SortOrderInput | SortOrder
    debit?: SortOrderInput | SortOrder
    credit?: SortOrderInput | SortOrder
    balance?: SortOrderInput | SortOrder
    checkAccountNumber?: SortOrderInput | SortOrder
    checkNumber?: SortOrderInput | SortOrder
    dateMatured?: SortOrderInput | SortOrder
    accountName?: SortOrderInput | SortOrder
    bankName?: SortOrderInput | SortOrder
    bankBranch?: SortOrderInput | SortOrder
    user?: SortOrderInput | SortOrder
    isCoincide?: SortOrderInput | SortOrder
    dailyClosing?: SortOrderInput | SortOrder
    approval?: SortOrderInput | SortOrder
    ftToLedger?: SortOrderInput | SortOrder
    ftToAccount?: SortOrderInput | SortOrder
    ssma_timestamp?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: TransactionOrderByRelevanceInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    seq?: IntNullableFilter<"Transaction"> | number | null
    ledger?: StringNullableFilter<"Transaction"> | string | null
    transNo?: StringNullableFilter<"Transaction"> | string | null
    code?: StringNullableFilter<"Transaction"> | string | null
    accountNumber?: StringNullableFilter<"Transaction"> | string | null
    date?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    invoiceNumber?: StringNullableFilter<"Transaction"> | string | null
    particulars?: StringNullableFilter<"Transaction"> | string | null
    debit?: FloatNullableFilter<"Transaction"> | number | null
    credit?: FloatNullableFilter<"Transaction"> | number | null
    balance?: FloatNullableFilter<"Transaction"> | number | null
    checkAccountNumber?: StringNullableFilter<"Transaction"> | string | null
    checkNumber?: StringNullableFilter<"Transaction"> | string | null
    dateMatured?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    accountName?: StringNullableFilter<"Transaction"> | string | null
    bankName?: StringNullableFilter<"Transaction"> | string | null
    bankBranch?: StringNullableFilter<"Transaction"> | string | null
    user?: StringNullableFilter<"Transaction"> | string | null
    isCoincide?: BoolNullableFilter<"Transaction"> | boolean | null
    dailyClosing?: IntNullableFilter<"Transaction"> | number | null
    approval?: StringNullableFilter<"Transaction"> | string | null
    ftToLedger?: StringNullableFilter<"Transaction"> | string | null
    ftToAccount?: StringNullableFilter<"Transaction"> | string | null
    ssma_timestamp?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    seq?: SortOrderInput | SortOrder
    ledger?: SortOrderInput | SortOrder
    transNo?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    accountNumber?: SortOrderInput | SortOrder
    date?: SortOrderInput | SortOrder
    invoiceNumber?: SortOrderInput | SortOrder
    particulars?: SortOrderInput | SortOrder
    debit?: SortOrderInput | SortOrder
    credit?: SortOrderInput | SortOrder
    balance?: SortOrderInput | SortOrder
    checkAccountNumber?: SortOrderInput | SortOrder
    checkNumber?: SortOrderInput | SortOrder
    dateMatured?: SortOrderInput | SortOrder
    accountName?: SortOrderInput | SortOrder
    bankName?: SortOrderInput | SortOrder
    bankBranch?: SortOrderInput | SortOrder
    user?: SortOrderInput | SortOrder
    isCoincide?: SortOrderInput | SortOrder
    dailyClosing?: SortOrderInput | SortOrder
    approval?: SortOrderInput | SortOrder
    ftToLedger?: SortOrderInput | SortOrder
    ftToAccount?: SortOrderInput | SortOrder
    ssma_timestamp?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    seq?: IntNullableWithAggregatesFilter<"Transaction"> | number | null
    ledger?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    transNo?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    code?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    accountNumber?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    date?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
    invoiceNumber?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    particulars?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    debit?: FloatNullableWithAggregatesFilter<"Transaction"> | number | null
    credit?: FloatNullableWithAggregatesFilter<"Transaction"> | number | null
    balance?: FloatNullableWithAggregatesFilter<"Transaction"> | number | null
    checkAccountNumber?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    checkNumber?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    dateMatured?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
    accountName?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    bankName?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    bankBranch?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    user?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    isCoincide?: BoolNullableWithAggregatesFilter<"Transaction"> | boolean | null
    dailyClosing?: IntNullableWithAggregatesFilter<"Transaction"> | number | null
    approval?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    ftToLedger?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    ftToAccount?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    ssma_timestamp?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type LoyaltyPointSettingWhereInput = {
    AND?: LoyaltyPointSettingWhereInput | LoyaltyPointSettingWhereInput[]
    OR?: LoyaltyPointSettingWhereInput[]
    NOT?: LoyaltyPointSettingWhereInput | LoyaltyPointSettingWhereInput[]
    id?: StringFilter<"LoyaltyPointSetting"> | string
    description?: StringFilter<"LoyaltyPointSetting"> | string
    amount?: FloatFilter<"LoyaltyPointSetting"> | number
    equivalentPoint?: FloatFilter<"LoyaltyPointSetting"> | number
    createdAt?: DateTimeFilter<"LoyaltyPointSetting"> | Date | string
    updatedAt?: DateTimeFilter<"LoyaltyPointSetting"> | Date | string
    loyaltyPoints?: LoyaltyPointListRelationFilter
  }

  export type LoyaltyPointSettingOrderByWithRelationInput = {
    id?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    equivalentPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    loyaltyPoints?: LoyaltyPointOrderByRelationAggregateInput
    _relevance?: LoyaltyPointSettingOrderByRelevanceInput
  }

  export type LoyaltyPointSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoyaltyPointSettingWhereInput | LoyaltyPointSettingWhereInput[]
    OR?: LoyaltyPointSettingWhereInput[]
    NOT?: LoyaltyPointSettingWhereInput | LoyaltyPointSettingWhereInput[]
    description?: StringFilter<"LoyaltyPointSetting"> | string
    amount?: FloatFilter<"LoyaltyPointSetting"> | number
    equivalentPoint?: FloatFilter<"LoyaltyPointSetting"> | number
    createdAt?: DateTimeFilter<"LoyaltyPointSetting"> | Date | string
    updatedAt?: DateTimeFilter<"LoyaltyPointSetting"> | Date | string
    loyaltyPoints?: LoyaltyPointListRelationFilter
  }, "id">

  export type LoyaltyPointSettingOrderByWithAggregationInput = {
    id?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    equivalentPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LoyaltyPointSettingCountOrderByAggregateInput
    _avg?: LoyaltyPointSettingAvgOrderByAggregateInput
    _max?: LoyaltyPointSettingMaxOrderByAggregateInput
    _min?: LoyaltyPointSettingMinOrderByAggregateInput
    _sum?: LoyaltyPointSettingSumOrderByAggregateInput
  }

  export type LoyaltyPointSettingScalarWhereWithAggregatesInput = {
    AND?: LoyaltyPointSettingScalarWhereWithAggregatesInput | LoyaltyPointSettingScalarWhereWithAggregatesInput[]
    OR?: LoyaltyPointSettingScalarWhereWithAggregatesInput[]
    NOT?: LoyaltyPointSettingScalarWhereWithAggregatesInput | LoyaltyPointSettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoyaltyPointSetting"> | string
    description?: StringWithAggregatesFilter<"LoyaltyPointSetting"> | string
    amount?: FloatWithAggregatesFilter<"LoyaltyPointSetting"> | number
    equivalentPoint?: FloatWithAggregatesFilter<"LoyaltyPointSetting"> | number
    createdAt?: DateTimeWithAggregatesFilter<"LoyaltyPointSetting"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LoyaltyPointSetting"> | Date | string
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    code?: StringFilter<"Customer"> | string
    customerName?: StringFilter<"Customer"> | string
    contactFirstName?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    phonePrimary?: StringNullableFilter<"Customer"> | string | null
    phoneAlternative?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    isActive?: BoolFilter<"Customer"> | boolean
    creditLimit?: FloatNullableFilter<"Customer"> | number | null
    isTaxExempt?: BoolFilter<"Customer"> | boolean
    paymentTerms?: StringNullableFilter<"Customer"> | string | null
    paymentTermsValue?: StringNullableFilter<"Customer"> | string | null
    salesperson?: StringNullableFilter<"Customer"> | string | null
    customerGroup?: StringNullableFilter<"Customer"> | string | null
    isEntitledToLoyaltyPoints?: BoolFilter<"Customer"> | boolean
    pointSetting?: StringNullableFilter<"Customer"> | string | null
    loyaltyCalculationMethod?: StringNullableFilter<"Customer"> | string | null
    loyaltyCardNumber?: StringNullableFilter<"Customer"> | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    loyaltyPoints?: LoyaltyPointListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    customerName?: SortOrder
    contactFirstName?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    phonePrimary?: SortOrderInput | SortOrder
    phoneAlternative?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    isActive?: SortOrder
    creditLimit?: SortOrderInput | SortOrder
    isTaxExempt?: SortOrder
    paymentTerms?: SortOrderInput | SortOrder
    paymentTermsValue?: SortOrderInput | SortOrder
    salesperson?: SortOrderInput | SortOrder
    customerGroup?: SortOrderInput | SortOrder
    isEntitledToLoyaltyPoints?: SortOrder
    pointSetting?: SortOrderInput | SortOrder
    loyaltyCalculationMethod?: SortOrderInput | SortOrder
    loyaltyCardNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    loyaltyPoints?: LoyaltyPointOrderByRelationAggregateInput
    _relevance?: CustomerOrderByRelevanceInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    customerName?: StringFilter<"Customer"> | string
    contactFirstName?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    phonePrimary?: StringNullableFilter<"Customer"> | string | null
    phoneAlternative?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    isActive?: BoolFilter<"Customer"> | boolean
    creditLimit?: FloatNullableFilter<"Customer"> | number | null
    isTaxExempt?: BoolFilter<"Customer"> | boolean
    paymentTerms?: StringNullableFilter<"Customer"> | string | null
    paymentTermsValue?: StringNullableFilter<"Customer"> | string | null
    salesperson?: StringNullableFilter<"Customer"> | string | null
    customerGroup?: StringNullableFilter<"Customer"> | string | null
    isEntitledToLoyaltyPoints?: BoolFilter<"Customer"> | boolean
    pointSetting?: StringNullableFilter<"Customer"> | string | null
    loyaltyCalculationMethod?: StringNullableFilter<"Customer"> | string | null
    loyaltyCardNumber?: StringNullableFilter<"Customer"> | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    loyaltyPoints?: LoyaltyPointListRelationFilter
  }, "id" | "code">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    customerName?: SortOrder
    contactFirstName?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    phonePrimary?: SortOrderInput | SortOrder
    phoneAlternative?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    isActive?: SortOrder
    creditLimit?: SortOrderInput | SortOrder
    isTaxExempt?: SortOrder
    paymentTerms?: SortOrderInput | SortOrder
    paymentTermsValue?: SortOrderInput | SortOrder
    salesperson?: SortOrderInput | SortOrder
    customerGroup?: SortOrderInput | SortOrder
    isEntitledToLoyaltyPoints?: SortOrder
    pointSetting?: SortOrderInput | SortOrder
    loyaltyCalculationMethod?: SortOrderInput | SortOrder
    loyaltyCardNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _avg?: CustomerAvgOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
    _sum?: CustomerSumOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    code?: StringWithAggregatesFilter<"Customer"> | string
    customerName?: StringWithAggregatesFilter<"Customer"> | string
    contactFirstName?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    address?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phonePrimary?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phoneAlternative?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    email?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    isActive?: BoolWithAggregatesFilter<"Customer"> | boolean
    creditLimit?: FloatNullableWithAggregatesFilter<"Customer"> | number | null
    isTaxExempt?: BoolWithAggregatesFilter<"Customer"> | boolean
    paymentTerms?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    paymentTermsValue?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    salesperson?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    customerGroup?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    isEntitledToLoyaltyPoints?: BoolWithAggregatesFilter<"Customer"> | boolean
    pointSetting?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    loyaltyCalculationMethod?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    loyaltyCardNumber?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type LoyaltyPointWhereInput = {
    AND?: LoyaltyPointWhereInput | LoyaltyPointWhereInput[]
    OR?: LoyaltyPointWhereInput[]
    NOT?: LoyaltyPointWhereInput | LoyaltyPointWhereInput[]
    id?: StringFilter<"LoyaltyPoint"> | string
    customerId?: StringFilter<"LoyaltyPoint"> | string
    loyaltyCardId?: StringFilter<"LoyaltyPoint"> | string
    totalPoints?: FloatFilter<"LoyaltyPoint"> | number
    pointSettingId?: StringFilter<"LoyaltyPoint"> | string
    expiryDate?: DateTimeNullableFilter<"LoyaltyPoint"> | Date | string | null
    createdAt?: DateTimeFilter<"LoyaltyPoint"> | Date | string
    updatedAt?: DateTimeFilter<"LoyaltyPoint"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    pointSetting?: XOR<LoyaltyPointSettingScalarRelationFilter, LoyaltyPointSettingWhereInput>
  }

  export type LoyaltyPointOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    loyaltyCardId?: SortOrder
    totalPoints?: SortOrder
    pointSettingId?: SortOrder
    expiryDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    pointSetting?: LoyaltyPointSettingOrderByWithRelationInput
    _relevance?: LoyaltyPointOrderByRelevanceInput
  }

  export type LoyaltyPointWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoyaltyPointWhereInput | LoyaltyPointWhereInput[]
    OR?: LoyaltyPointWhereInput[]
    NOT?: LoyaltyPointWhereInput | LoyaltyPointWhereInput[]
    customerId?: StringFilter<"LoyaltyPoint"> | string
    loyaltyCardId?: StringFilter<"LoyaltyPoint"> | string
    totalPoints?: FloatFilter<"LoyaltyPoint"> | number
    pointSettingId?: StringFilter<"LoyaltyPoint"> | string
    expiryDate?: DateTimeNullableFilter<"LoyaltyPoint"> | Date | string | null
    createdAt?: DateTimeFilter<"LoyaltyPoint"> | Date | string
    updatedAt?: DateTimeFilter<"LoyaltyPoint"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    pointSetting?: XOR<LoyaltyPointSettingScalarRelationFilter, LoyaltyPointSettingWhereInput>
  }, "id">

  export type LoyaltyPointOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    loyaltyCardId?: SortOrder
    totalPoints?: SortOrder
    pointSettingId?: SortOrder
    expiryDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LoyaltyPointCountOrderByAggregateInput
    _avg?: LoyaltyPointAvgOrderByAggregateInput
    _max?: LoyaltyPointMaxOrderByAggregateInput
    _min?: LoyaltyPointMinOrderByAggregateInput
    _sum?: LoyaltyPointSumOrderByAggregateInput
  }

  export type LoyaltyPointScalarWhereWithAggregatesInput = {
    AND?: LoyaltyPointScalarWhereWithAggregatesInput | LoyaltyPointScalarWhereWithAggregatesInput[]
    OR?: LoyaltyPointScalarWhereWithAggregatesInput[]
    NOT?: LoyaltyPointScalarWhereWithAggregatesInput | LoyaltyPointScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoyaltyPoint"> | string
    customerId?: StringWithAggregatesFilter<"LoyaltyPoint"> | string
    loyaltyCardId?: StringWithAggregatesFilter<"LoyaltyPoint"> | string
    totalPoints?: FloatWithAggregatesFilter<"LoyaltyPoint"> | number
    pointSettingId?: StringWithAggregatesFilter<"LoyaltyPoint"> | string
    expiryDate?: DateTimeNullableWithAggregatesFilter<"LoyaltyPoint"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LoyaltyPoint"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LoyaltyPoint"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    code?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    barcode?: StringNullableFilter<"Product"> | string | null
    description?: StringNullableFilter<"Product"> | string | null
    additionalDescription?: StringNullableFilter<"Product"> | string | null
    category?: StringNullableFilter<"Product"> | string | null
    categoryId?: StringNullableFilter<"Product"> | string | null
    subcategoryId?: StringNullableFilter<"Product"> | string | null
    brandId?: StringNullableFilter<"Product"> | string | null
    supplierId?: StringNullableFilter<"Product"> | string | null
    unitOfMeasureId?: StringNullableFilter<"Product"> | string | null
    unitPrice?: FloatFilter<"Product"> | number
    costPrice?: FloatFilter<"Product"> | number
    stockQuantity?: IntFilter<"Product"> | number
    minStockLevel?: IntFilter<"Product"> | number
    maxStockLevel?: IntNullableFilter<"Product"> | number | null
    isActive?: BoolFilter<"Product"> | boolean
    salesOrder?: StringNullableFilter<"Product"> | string | null
    autoCreateChildren?: BoolFilter<"Product"> | boolean
    initialStock?: IntFilter<"Product"> | number
    reorderPoint?: IntFilter<"Product"> | number
    incomeAccountId?: StringNullableFilter<"Product"> | string | null
    expenseAccountId?: StringNullableFilter<"Product"> | string | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    barcode?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    additionalDescription?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    categoryId?: SortOrderInput | SortOrder
    subcategoryId?: SortOrderInput | SortOrder
    brandId?: SortOrderInput | SortOrder
    supplierId?: SortOrderInput | SortOrder
    unitOfMeasureId?: SortOrderInput | SortOrder
    unitPrice?: SortOrder
    costPrice?: SortOrder
    stockQuantity?: SortOrder
    minStockLevel?: SortOrder
    maxStockLevel?: SortOrderInput | SortOrder
    isActive?: SortOrder
    salesOrder?: SortOrderInput | SortOrder
    autoCreateChildren?: SortOrder
    initialStock?: SortOrder
    reorderPoint?: SortOrder
    incomeAccountId?: SortOrderInput | SortOrder
    expenseAccountId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: ProductOrderByRelevanceInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    barcode?: StringNullableFilter<"Product"> | string | null
    description?: StringNullableFilter<"Product"> | string | null
    additionalDescription?: StringNullableFilter<"Product"> | string | null
    category?: StringNullableFilter<"Product"> | string | null
    categoryId?: StringNullableFilter<"Product"> | string | null
    subcategoryId?: StringNullableFilter<"Product"> | string | null
    brandId?: StringNullableFilter<"Product"> | string | null
    supplierId?: StringNullableFilter<"Product"> | string | null
    unitOfMeasureId?: StringNullableFilter<"Product"> | string | null
    unitPrice?: FloatFilter<"Product"> | number
    costPrice?: FloatFilter<"Product"> | number
    stockQuantity?: IntFilter<"Product"> | number
    minStockLevel?: IntFilter<"Product"> | number
    maxStockLevel?: IntNullableFilter<"Product"> | number | null
    isActive?: BoolFilter<"Product"> | boolean
    salesOrder?: StringNullableFilter<"Product"> | string | null
    autoCreateChildren?: BoolFilter<"Product"> | boolean
    initialStock?: IntFilter<"Product"> | number
    reorderPoint?: IntFilter<"Product"> | number
    incomeAccountId?: StringNullableFilter<"Product"> | string | null
    expenseAccountId?: StringNullableFilter<"Product"> | string | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
  }, "id" | "code">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    barcode?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    additionalDescription?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    categoryId?: SortOrderInput | SortOrder
    subcategoryId?: SortOrderInput | SortOrder
    brandId?: SortOrderInput | SortOrder
    supplierId?: SortOrderInput | SortOrder
    unitOfMeasureId?: SortOrderInput | SortOrder
    unitPrice?: SortOrder
    costPrice?: SortOrder
    stockQuantity?: SortOrder
    minStockLevel?: SortOrder
    maxStockLevel?: SortOrderInput | SortOrder
    isActive?: SortOrder
    salesOrder?: SortOrderInput | SortOrder
    autoCreateChildren?: SortOrder
    initialStock?: SortOrder
    reorderPoint?: SortOrder
    incomeAccountId?: SortOrderInput | SortOrder
    expenseAccountId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    code?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    barcode?: StringNullableWithAggregatesFilter<"Product"> | string | null
    description?: StringNullableWithAggregatesFilter<"Product"> | string | null
    additionalDescription?: StringNullableWithAggregatesFilter<"Product"> | string | null
    category?: StringNullableWithAggregatesFilter<"Product"> | string | null
    categoryId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    subcategoryId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    brandId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    supplierId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    unitOfMeasureId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    unitPrice?: FloatWithAggregatesFilter<"Product"> | number
    costPrice?: FloatWithAggregatesFilter<"Product"> | number
    stockQuantity?: IntWithAggregatesFilter<"Product"> | number
    minStockLevel?: IntWithAggregatesFilter<"Product"> | number
    maxStockLevel?: IntNullableWithAggregatesFilter<"Product"> | number | null
    isActive?: BoolWithAggregatesFilter<"Product"> | boolean
    salesOrder?: StringNullableWithAggregatesFilter<"Product"> | string | null
    autoCreateChildren?: BoolWithAggregatesFilter<"Product"> | boolean
    initialStock?: IntWithAggregatesFilter<"Product"> | number
    reorderPoint?: IntWithAggregatesFilter<"Product"> | number
    incomeAccountId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    expenseAccountId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type ConversionFactorWhereInput = {
    AND?: ConversionFactorWhereInput | ConversionFactorWhereInput[]
    OR?: ConversionFactorWhereInput[]
    NOT?: ConversionFactorWhereInput | ConversionFactorWhereInput[]
    id?: StringFilter<"ConversionFactor"> | string
    productId?: StringFilter<"ConversionFactor"> | string
    unitName?: StringFilter<"ConversionFactor"> | string
    factor?: FloatFilter<"ConversionFactor"> | number
    createdAt?: DateTimeFilter<"ConversionFactor"> | Date | string
    updatedAt?: DateTimeFilter<"ConversionFactor"> | Date | string
  }

  export type ConversionFactorOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    unitName?: SortOrder
    factor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: ConversionFactorOrderByRelevanceInput
  }

  export type ConversionFactorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConversionFactorWhereInput | ConversionFactorWhereInput[]
    OR?: ConversionFactorWhereInput[]
    NOT?: ConversionFactorWhereInput | ConversionFactorWhereInput[]
    productId?: StringFilter<"ConversionFactor"> | string
    unitName?: StringFilter<"ConversionFactor"> | string
    factor?: FloatFilter<"ConversionFactor"> | number
    createdAt?: DateTimeFilter<"ConversionFactor"> | Date | string
    updatedAt?: DateTimeFilter<"ConversionFactor"> | Date | string
  }, "id">

  export type ConversionFactorOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    unitName?: SortOrder
    factor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConversionFactorCountOrderByAggregateInput
    _avg?: ConversionFactorAvgOrderByAggregateInput
    _max?: ConversionFactorMaxOrderByAggregateInput
    _min?: ConversionFactorMinOrderByAggregateInput
    _sum?: ConversionFactorSumOrderByAggregateInput
  }

  export type ConversionFactorScalarWhereWithAggregatesInput = {
    AND?: ConversionFactorScalarWhereWithAggregatesInput | ConversionFactorScalarWhereWithAggregatesInput[]
    OR?: ConversionFactorScalarWhereWithAggregatesInput[]
    NOT?: ConversionFactorScalarWhereWithAggregatesInput | ConversionFactorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConversionFactor"> | string
    productId?: StringWithAggregatesFilter<"ConversionFactor"> | string
    unitName?: StringWithAggregatesFilter<"ConversionFactor"> | string
    factor?: FloatWithAggregatesFilter<"ConversionFactor"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ConversionFactor"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ConversionFactor"> | Date | string
  }

  export type BrandWhereInput = {
    AND?: BrandWhereInput | BrandWhereInput[]
    OR?: BrandWhereInput[]
    NOT?: BrandWhereInput | BrandWhereInput[]
    id?: StringFilter<"Brand"> | string
    name?: StringFilter<"Brand"> | string
    description?: StringNullableFilter<"Brand"> | string | null
    createdAt?: DateTimeFilter<"Brand"> | Date | string
    updatedAt?: DateTimeFilter<"Brand"> | Date | string
  }

  export type BrandOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: BrandOrderByRelevanceInput
  }

  export type BrandWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: BrandWhereInput | BrandWhereInput[]
    OR?: BrandWhereInput[]
    NOT?: BrandWhereInput | BrandWhereInput[]
    description?: StringNullableFilter<"Brand"> | string | null
    createdAt?: DateTimeFilter<"Brand"> | Date | string
    updatedAt?: DateTimeFilter<"Brand"> | Date | string
  }, "id" | "name">

  export type BrandOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BrandCountOrderByAggregateInput
    _max?: BrandMaxOrderByAggregateInput
    _min?: BrandMinOrderByAggregateInput
  }

  export type BrandScalarWhereWithAggregatesInput = {
    AND?: BrandScalarWhereWithAggregatesInput | BrandScalarWhereWithAggregatesInput[]
    OR?: BrandScalarWhereWithAggregatesInput[]
    NOT?: BrandScalarWhereWithAggregatesInput | BrandScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Brand"> | string
    name?: StringWithAggregatesFilter<"Brand"> | string
    description?: StringNullableWithAggregatesFilter<"Brand"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Brand"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Brand"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    description?: StringNullableFilter<"Category"> | string | null
    parentCategoryId?: StringNullableFilter<"Category"> | string | null
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    parentCategoryId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: CategoryOrderByRelevanceInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    description?: StringNullableFilter<"Category"> | string | null
    parentCategoryId?: StringNullableFilter<"Category"> | string | null
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
  }, "id" | "name">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    parentCategoryId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Category"> | string
    name?: StringWithAggregatesFilter<"Category"> | string
    description?: StringNullableWithAggregatesFilter<"Category"> | string | null
    parentCategoryId?: StringNullableWithAggregatesFilter<"Category"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type SupplierWhereInput = {
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    id?: StringFilter<"Supplier"> | string
    name?: StringFilter<"Supplier"> | string
    contactPerson?: StringNullableFilter<"Supplier"> | string | null
    email?: StringNullableFilter<"Supplier"> | string | null
    phone?: StringNullableFilter<"Supplier"> | string | null
    address?: StringNullableFilter<"Supplier"> | string | null
    paymentTerms?: StringNullableFilter<"Supplier"> | string | null
    isActive?: BoolFilter<"Supplier"> | boolean
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeFilter<"Supplier"> | Date | string
  }

  export type SupplierOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    paymentTerms?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: SupplierOrderByRelevanceInput
  }

  export type SupplierWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    contactPerson?: StringNullableFilter<"Supplier"> | string | null
    email?: StringNullableFilter<"Supplier"> | string | null
    phone?: StringNullableFilter<"Supplier"> | string | null
    address?: StringNullableFilter<"Supplier"> | string | null
    paymentTerms?: StringNullableFilter<"Supplier"> | string | null
    isActive?: BoolFilter<"Supplier"> | boolean
    createdAt?: DateTimeFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeFilter<"Supplier"> | Date | string
  }, "id" | "name">

  export type SupplierOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    paymentTerms?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupplierCountOrderByAggregateInput
    _max?: SupplierMaxOrderByAggregateInput
    _min?: SupplierMinOrderByAggregateInput
  }

  export type SupplierScalarWhereWithAggregatesInput = {
    AND?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    OR?: SupplierScalarWhereWithAggregatesInput[]
    NOT?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Supplier"> | string
    name?: StringWithAggregatesFilter<"Supplier"> | string
    contactPerson?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    email?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    address?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    paymentTerms?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    isActive?: BoolWithAggregatesFilter<"Supplier"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
  }

  export type UnitOfMeasureWhereInput = {
    AND?: UnitOfMeasureWhereInput | UnitOfMeasureWhereInput[]
    OR?: UnitOfMeasureWhereInput[]
    NOT?: UnitOfMeasureWhereInput | UnitOfMeasureWhereInput[]
    id?: StringFilter<"UnitOfMeasure"> | string
    code?: StringFilter<"UnitOfMeasure"> | string
    name?: StringFilter<"UnitOfMeasure"> | string
    description?: StringNullableFilter<"UnitOfMeasure"> | string | null
    isActive?: BoolFilter<"UnitOfMeasure"> | boolean
    createdAt?: DateTimeFilter<"UnitOfMeasure"> | Date | string
    updatedAt?: DateTimeFilter<"UnitOfMeasure"> | Date | string
  }

  export type UnitOfMeasureOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: UnitOfMeasureOrderByRelevanceInput
  }

  export type UnitOfMeasureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    name?: string
    AND?: UnitOfMeasureWhereInput | UnitOfMeasureWhereInput[]
    OR?: UnitOfMeasureWhereInput[]
    NOT?: UnitOfMeasureWhereInput | UnitOfMeasureWhereInput[]
    description?: StringNullableFilter<"UnitOfMeasure"> | string | null
    isActive?: BoolFilter<"UnitOfMeasure"> | boolean
    createdAt?: DateTimeFilter<"UnitOfMeasure"> | Date | string
    updatedAt?: DateTimeFilter<"UnitOfMeasure"> | Date | string
  }, "id" | "code" | "name">

  export type UnitOfMeasureOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UnitOfMeasureCountOrderByAggregateInput
    _max?: UnitOfMeasureMaxOrderByAggregateInput
    _min?: UnitOfMeasureMinOrderByAggregateInput
  }

  export type UnitOfMeasureScalarWhereWithAggregatesInput = {
    AND?: UnitOfMeasureScalarWhereWithAggregatesInput | UnitOfMeasureScalarWhereWithAggregatesInput[]
    OR?: UnitOfMeasureScalarWhereWithAggregatesInput[]
    NOT?: UnitOfMeasureScalarWhereWithAggregatesInput | UnitOfMeasureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UnitOfMeasure"> | string
    code?: StringWithAggregatesFilter<"UnitOfMeasure"> | string
    name?: StringWithAggregatesFilter<"UnitOfMeasure"> | string
    description?: StringNullableWithAggregatesFilter<"UnitOfMeasure"> | string | null
    isActive?: BoolWithAggregatesFilter<"UnitOfMeasure"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"UnitOfMeasure"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UnitOfMeasure"> | Date | string
  }

  export type ReminderWhereInput = {
    AND?: ReminderWhereInput | ReminderWhereInput[]
    OR?: ReminderWhereInput[]
    NOT?: ReminderWhereInput | ReminderWhereInput[]
    id?: StringFilter<"Reminder"> | string
    title?: StringFilter<"Reminder"> | string
    memo?: StringNullableFilter<"Reminder"> | string | null
    date?: DateTimeFilter<"Reminder"> | Date | string
    endDate?: DateTimeNullableFilter<"Reminder"> | Date | string | null
    isActive?: BoolFilter<"Reminder"> | boolean
    isRead?: BoolFilter<"Reminder"> | boolean
    createdAt?: DateTimeFilter<"Reminder"> | Date | string
    updatedAt?: DateTimeFilter<"Reminder"> | Date | string
  }

  export type ReminderOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    memo?: SortOrderInput | SortOrder
    date?: SortOrder
    endDate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: ReminderOrderByRelevanceInput
  }

  export type ReminderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReminderWhereInput | ReminderWhereInput[]
    OR?: ReminderWhereInput[]
    NOT?: ReminderWhereInput | ReminderWhereInput[]
    title?: StringFilter<"Reminder"> | string
    memo?: StringNullableFilter<"Reminder"> | string | null
    date?: DateTimeFilter<"Reminder"> | Date | string
    endDate?: DateTimeNullableFilter<"Reminder"> | Date | string | null
    isActive?: BoolFilter<"Reminder"> | boolean
    isRead?: BoolFilter<"Reminder"> | boolean
    createdAt?: DateTimeFilter<"Reminder"> | Date | string
    updatedAt?: DateTimeFilter<"Reminder"> | Date | string
  }, "id">

  export type ReminderOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    memo?: SortOrderInput | SortOrder
    date?: SortOrder
    endDate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReminderCountOrderByAggregateInput
    _max?: ReminderMaxOrderByAggregateInput
    _min?: ReminderMinOrderByAggregateInput
  }

  export type ReminderScalarWhereWithAggregatesInput = {
    AND?: ReminderScalarWhereWithAggregatesInput | ReminderScalarWhereWithAggregatesInput[]
    OR?: ReminderScalarWhereWithAggregatesInput[]
    NOT?: ReminderScalarWhereWithAggregatesInput | ReminderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reminder"> | string
    title?: StringWithAggregatesFilter<"Reminder"> | string
    memo?: StringNullableWithAggregatesFilter<"Reminder"> | string | null
    date?: DateTimeWithAggregatesFilter<"Reminder"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"Reminder"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"Reminder"> | boolean
    isRead?: BoolWithAggregatesFilter<"Reminder"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Reminder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Reminder"> | Date | string
  }

  export type SalesUserWhereInput = {
    AND?: SalesUserWhereInput | SalesUserWhereInput[]
    OR?: SalesUserWhereInput[]
    NOT?: SalesUserWhereInput | SalesUserWhereInput[]
    id?: StringFilter<"SalesUser"> | string
    name?: StringFilter<"SalesUser"> | string
    uniqueId?: StringFilter<"SalesUser"> | string
    username?: StringNullableFilter<"SalesUser"> | string | null
    isActive?: BoolFilter<"SalesUser"> | boolean
    createdAt?: DateTimeFilter<"SalesUser"> | Date | string
    updatedAt?: DateTimeFilter<"SalesUser"> | Date | string
  }

  export type SalesUserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    uniqueId?: SortOrder
    username?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: SalesUserOrderByRelevanceInput
  }

  export type SalesUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    uniqueId?: string
    AND?: SalesUserWhereInput | SalesUserWhereInput[]
    OR?: SalesUserWhereInput[]
    NOT?: SalesUserWhereInput | SalesUserWhereInput[]
    name?: StringFilter<"SalesUser"> | string
    username?: StringNullableFilter<"SalesUser"> | string | null
    isActive?: BoolFilter<"SalesUser"> | boolean
    createdAt?: DateTimeFilter<"SalesUser"> | Date | string
    updatedAt?: DateTimeFilter<"SalesUser"> | Date | string
  }, "id" | "uniqueId">

  export type SalesUserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    uniqueId?: SortOrder
    username?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SalesUserCountOrderByAggregateInput
    _max?: SalesUserMaxOrderByAggregateInput
    _min?: SalesUserMinOrderByAggregateInput
  }

  export type SalesUserScalarWhereWithAggregatesInput = {
    AND?: SalesUserScalarWhereWithAggregatesInput | SalesUserScalarWhereWithAggregatesInput[]
    OR?: SalesUserScalarWhereWithAggregatesInput[]
    NOT?: SalesUserScalarWhereWithAggregatesInput | SalesUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SalesUser"> | string
    name?: StringWithAggregatesFilter<"SalesUser"> | string
    uniqueId?: StringWithAggregatesFilter<"SalesUser"> | string
    username?: StringNullableWithAggregatesFilter<"SalesUser"> | string | null
    isActive?: BoolWithAggregatesFilter<"SalesUser"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SalesUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SalesUser"> | Date | string
  }

  export type UserPermissionWhereInput = {
    AND?: UserPermissionWhereInput | UserPermissionWhereInput[]
    OR?: UserPermissionWhereInput[]
    NOT?: UserPermissionWhereInput | UserPermissionWhereInput[]
    id?: StringFilter<"UserPermission"> | string
    username?: StringFilter<"UserPermission"> | string
    firstName?: StringFilter<"UserPermission"> | string
    middleName?: StringNullableFilter<"UserPermission"> | string | null
    lastName?: StringFilter<"UserPermission"> | string
    designation?: StringFilter<"UserPermission"> | string
    userAccess?: StringFilter<"UserPermission"> | string
    contactNo?: StringNullableFilter<"UserPermission"> | string | null
    accountType?: StringFilter<"UserPermission"> | string
    password?: StringNullableFilter<"UserPermission"> | string | null
    permissions?: StringFilter<"UserPermission"> | string
    isActive?: BoolFilter<"UserPermission"> | boolean
    createdAt?: DateTimeFilter<"UserPermission"> | Date | string
    updatedAt?: DateTimeFilter<"UserPermission"> | Date | string
  }

  export type UserPermissionOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    middleName?: SortOrderInput | SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    userAccess?: SortOrder
    contactNo?: SortOrderInput | SortOrder
    accountType?: SortOrder
    password?: SortOrderInput | SortOrder
    permissions?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: UserPermissionOrderByRelevanceInput
  }

  export type UserPermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserPermissionWhereInput | UserPermissionWhereInput[]
    OR?: UserPermissionWhereInput[]
    NOT?: UserPermissionWhereInput | UserPermissionWhereInput[]
    firstName?: StringFilter<"UserPermission"> | string
    middleName?: StringNullableFilter<"UserPermission"> | string | null
    lastName?: StringFilter<"UserPermission"> | string
    designation?: StringFilter<"UserPermission"> | string
    userAccess?: StringFilter<"UserPermission"> | string
    contactNo?: StringNullableFilter<"UserPermission"> | string | null
    accountType?: StringFilter<"UserPermission"> | string
    password?: StringNullableFilter<"UserPermission"> | string | null
    permissions?: StringFilter<"UserPermission"> | string
    isActive?: BoolFilter<"UserPermission"> | boolean
    createdAt?: DateTimeFilter<"UserPermission"> | Date | string
    updatedAt?: DateTimeFilter<"UserPermission"> | Date | string
  }, "id" | "username">

  export type UserPermissionOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    middleName?: SortOrderInput | SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    userAccess?: SortOrder
    contactNo?: SortOrderInput | SortOrder
    accountType?: SortOrder
    password?: SortOrderInput | SortOrder
    permissions?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserPermissionCountOrderByAggregateInput
    _max?: UserPermissionMaxOrderByAggregateInput
    _min?: UserPermissionMinOrderByAggregateInput
  }

  export type UserPermissionScalarWhereWithAggregatesInput = {
    AND?: UserPermissionScalarWhereWithAggregatesInput | UserPermissionScalarWhereWithAggregatesInput[]
    OR?: UserPermissionScalarWhereWithAggregatesInput[]
    NOT?: UserPermissionScalarWhereWithAggregatesInput | UserPermissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserPermission"> | string
    username?: StringWithAggregatesFilter<"UserPermission"> | string
    firstName?: StringWithAggregatesFilter<"UserPermission"> | string
    middleName?: StringNullableWithAggregatesFilter<"UserPermission"> | string | null
    lastName?: StringWithAggregatesFilter<"UserPermission"> | string
    designation?: StringWithAggregatesFilter<"UserPermission"> | string
    userAccess?: StringWithAggregatesFilter<"UserPermission"> | string
    contactNo?: StringNullableWithAggregatesFilter<"UserPermission"> | string | null
    accountType?: StringWithAggregatesFilter<"UserPermission"> | string
    password?: StringNullableWithAggregatesFilter<"UserPermission"> | string | null
    permissions?: StringWithAggregatesFilter<"UserPermission"> | string
    isActive?: BoolWithAggregatesFilter<"UserPermission"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"UserPermission"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserPermission"> | Date | string
  }

  export type BusinessProfileWhereInput = {
    AND?: BusinessProfileWhereInput | BusinessProfileWhereInput[]
    OR?: BusinessProfileWhereInput[]
    NOT?: BusinessProfileWhereInput | BusinessProfileWhereInput[]
    id?: StringFilter<"BusinessProfile"> | string
    businessName?: StringFilter<"BusinessProfile"> | string
    address?: StringNullableFilter<"BusinessProfile"> | string | null
    owner?: StringNullableFilter<"BusinessProfile"> | string | null
    contactPhone?: StringNullableFilter<"BusinessProfile"> | string | null
    contactTel?: StringNullableFilter<"BusinessProfile"> | string | null
    email?: StringNullableFilter<"BusinessProfile"> | string | null
    tin?: StringNullableFilter<"BusinessProfile"> | string | null
    permit?: StringNullableFilter<"BusinessProfile"> | string | null
    logo?: StringNullableFilter<"BusinessProfile"> | string | null
    createdAt?: DateTimeFilter<"BusinessProfile"> | Date | string
    updatedAt?: DateTimeFilter<"BusinessProfile"> | Date | string
  }

  export type BusinessProfileOrderByWithRelationInput = {
    id?: SortOrder
    businessName?: SortOrder
    address?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    contactTel?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    tin?: SortOrderInput | SortOrder
    permit?: SortOrderInput | SortOrder
    logo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: BusinessProfileOrderByRelevanceInput
  }

  export type BusinessProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BusinessProfileWhereInput | BusinessProfileWhereInput[]
    OR?: BusinessProfileWhereInput[]
    NOT?: BusinessProfileWhereInput | BusinessProfileWhereInput[]
    businessName?: StringFilter<"BusinessProfile"> | string
    address?: StringNullableFilter<"BusinessProfile"> | string | null
    owner?: StringNullableFilter<"BusinessProfile"> | string | null
    contactPhone?: StringNullableFilter<"BusinessProfile"> | string | null
    contactTel?: StringNullableFilter<"BusinessProfile"> | string | null
    email?: StringNullableFilter<"BusinessProfile"> | string | null
    tin?: StringNullableFilter<"BusinessProfile"> | string | null
    permit?: StringNullableFilter<"BusinessProfile"> | string | null
    logo?: StringNullableFilter<"BusinessProfile"> | string | null
    createdAt?: DateTimeFilter<"BusinessProfile"> | Date | string
    updatedAt?: DateTimeFilter<"BusinessProfile"> | Date | string
  }, "id">

  export type BusinessProfileOrderByWithAggregationInput = {
    id?: SortOrder
    businessName?: SortOrder
    address?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    contactTel?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    tin?: SortOrderInput | SortOrder
    permit?: SortOrderInput | SortOrder
    logo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BusinessProfileCountOrderByAggregateInput
    _max?: BusinessProfileMaxOrderByAggregateInput
    _min?: BusinessProfileMinOrderByAggregateInput
  }

  export type BusinessProfileScalarWhereWithAggregatesInput = {
    AND?: BusinessProfileScalarWhereWithAggregatesInput | BusinessProfileScalarWhereWithAggregatesInput[]
    OR?: BusinessProfileScalarWhereWithAggregatesInput[]
    NOT?: BusinessProfileScalarWhereWithAggregatesInput | BusinessProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BusinessProfile"> | string
    businessName?: StringWithAggregatesFilter<"BusinessProfile"> | string
    address?: StringNullableWithAggregatesFilter<"BusinessProfile"> | string | null
    owner?: StringNullableWithAggregatesFilter<"BusinessProfile"> | string | null
    contactPhone?: StringNullableWithAggregatesFilter<"BusinessProfile"> | string | null
    contactTel?: StringNullableWithAggregatesFilter<"BusinessProfile"> | string | null
    email?: StringNullableWithAggregatesFilter<"BusinessProfile"> | string | null
    tin?: StringNullableWithAggregatesFilter<"BusinessProfile"> | string | null
    permit?: StringNullableWithAggregatesFilter<"BusinessProfile"> | string | null
    logo?: StringNullableWithAggregatesFilter<"BusinessProfile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BusinessProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BusinessProfile"> | Date | string
  }

  export type BackupScheduleWhereInput = {
    AND?: BackupScheduleWhereInput | BackupScheduleWhereInput[]
    OR?: BackupScheduleWhereInput[]
    NOT?: BackupScheduleWhereInput | BackupScheduleWhereInput[]
    id?: StringFilter<"BackupSchedule"> | string
    backupTime?: DateTimeFilter<"BackupSchedule"> | Date | string
    frequency?: StringFilter<"BackupSchedule"> | string
    createdAt?: DateTimeFilter<"BackupSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"BackupSchedule"> | Date | string
  }

  export type BackupScheduleOrderByWithRelationInput = {
    id?: SortOrder
    backupTime?: SortOrder
    frequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: BackupScheduleOrderByRelevanceInput
  }

  export type BackupScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BackupScheduleWhereInput | BackupScheduleWhereInput[]
    OR?: BackupScheduleWhereInput[]
    NOT?: BackupScheduleWhereInput | BackupScheduleWhereInput[]
    backupTime?: DateTimeFilter<"BackupSchedule"> | Date | string
    frequency?: StringFilter<"BackupSchedule"> | string
    createdAt?: DateTimeFilter<"BackupSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"BackupSchedule"> | Date | string
  }, "id">

  export type BackupScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    backupTime?: SortOrder
    frequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BackupScheduleCountOrderByAggregateInput
    _max?: BackupScheduleMaxOrderByAggregateInput
    _min?: BackupScheduleMinOrderByAggregateInput
  }

  export type BackupScheduleScalarWhereWithAggregatesInput = {
    AND?: BackupScheduleScalarWhereWithAggregatesInput | BackupScheduleScalarWhereWithAggregatesInput[]
    OR?: BackupScheduleScalarWhereWithAggregatesInput[]
    NOT?: BackupScheduleScalarWhereWithAggregatesInput | BackupScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BackupSchedule"> | string
    backupTime?: DateTimeWithAggregatesFilter<"BackupSchedule"> | Date | string
    frequency?: StringWithAggregatesFilter<"BackupSchedule"> | string
    createdAt?: DateTimeWithAggregatesFilter<"BackupSchedule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BackupSchedule"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringNullableFilter<"Notification"> | string | null
    entityId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrderInput | SortOrder
    entityId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    _relevance?: NotificationOrderByRelevanceInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringNullableFilter<"Notification"> | string | null
    entityId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrderInput | SortOrder
    entityId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    entityId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    accnt_no: number
    accnt_type_no?: number
    name: string
    balance?: number | null
    type: string
    header: string
    bank: string
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    accnt_no: number
    accnt_type_no?: number
    name: string
    balance?: number | null
    type: string
    header: string
    bank: string
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accnt_no?: IntFieldUpdateOperationsInput | number
    accnt_type_no?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    balance?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: StringFieldUpdateOperationsInput | string
    header?: StringFieldUpdateOperationsInput | string
    bank?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accnt_no?: IntFieldUpdateOperationsInput | number
    accnt_type_no?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    balance?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: StringFieldUpdateOperationsInput | string
    header?: StringFieldUpdateOperationsInput | string
    bank?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id?: string
    accnt_no: number
    accnt_type_no?: number
    name: string
    balance?: number | null
    type: string
    header: string
    bank: string
    category?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accnt_no?: IntFieldUpdateOperationsInput | number
    accnt_type_no?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    balance?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: StringFieldUpdateOperationsInput | string
    header?: StringFieldUpdateOperationsInput | string
    bank?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accnt_no?: IntFieldUpdateOperationsInput | number
    accnt_type_no?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    balance?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: StringFieldUpdateOperationsInput | string
    header?: StringFieldUpdateOperationsInput | string
    bank?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    id?: string
    seq?: number | null
    ledger?: string | null
    transNo?: string | null
    code?: string | null
    accountNumber?: string | null
    date?: Date | string | null
    invoiceNumber?: string | null
    particulars?: string | null
    debit?: number | null
    credit?: number | null
    balance?: number | null
    checkAccountNumber?: string | null
    checkNumber?: string | null
    dateMatured?: Date | string | null
    accountName?: string | null
    bankName?: string | null
    bankBranch?: string | null
    user?: string | null
    isCoincide?: boolean | null
    dailyClosing?: number | null
    approval?: string | null
    ftToLedger?: string | null
    ftToAccount?: string | null
    ssma_timestamp?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    seq?: number | null
    ledger?: string | null
    transNo?: string | null
    code?: string | null
    accountNumber?: string | null
    date?: Date | string | null
    invoiceNumber?: string | null
    particulars?: string | null
    debit?: number | null
    credit?: number | null
    balance?: number | null
    checkAccountNumber?: string | null
    checkNumber?: string | null
    dateMatured?: Date | string | null
    accountName?: string | null
    bankName?: string | null
    bankBranch?: string | null
    user?: string | null
    isCoincide?: boolean | null
    dailyClosing?: number | null
    approval?: string | null
    ftToLedger?: string | null
    ftToAccount?: string | null
    ssma_timestamp?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seq?: NullableIntFieldUpdateOperationsInput | number | null
    ledger?: NullableStringFieldUpdateOperationsInput | string | null
    transNo?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    accountNumber?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    particulars?: NullableStringFieldUpdateOperationsInput | string | null
    debit?: NullableFloatFieldUpdateOperationsInput | number | null
    credit?: NullableFloatFieldUpdateOperationsInput | number | null
    balance?: NullableFloatFieldUpdateOperationsInput | number | null
    checkAccountNumber?: NullableStringFieldUpdateOperationsInput | string | null
    checkNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateMatured?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accountName?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: NullableStringFieldUpdateOperationsInput | string | null
    bankBranch?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    isCoincide?: NullableBoolFieldUpdateOperationsInput | boolean | null
    dailyClosing?: NullableIntFieldUpdateOperationsInput | number | null
    approval?: NullableStringFieldUpdateOperationsInput | string | null
    ftToLedger?: NullableStringFieldUpdateOperationsInput | string | null
    ftToAccount?: NullableStringFieldUpdateOperationsInput | string | null
    ssma_timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    seq?: NullableIntFieldUpdateOperationsInput | number | null
    ledger?: NullableStringFieldUpdateOperationsInput | string | null
    transNo?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    accountNumber?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    particulars?: NullableStringFieldUpdateOperationsInput | string | null
    debit?: NullableFloatFieldUpdateOperationsInput | number | null
    credit?: NullableFloatFieldUpdateOperationsInput | number | null
    balance?: NullableFloatFieldUpdateOperationsInput | number | null
    checkAccountNumber?: NullableStringFieldUpdateOperationsInput | string | null
    checkNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateMatured?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accountName?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: NullableStringFieldUpdateOperationsInput | string | null
    bankBranch?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    isCoincide?: NullableBoolFieldUpdateOperationsInput | boolean | null
    dailyClosing?: NullableIntFieldUpdateOperationsInput | number | null
    approval?: NullableStringFieldUpdateOperationsInput | string | null
    ftToLedger?: NullableStringFieldUpdateOperationsInput | string | null
    ftToAccount?: NullableStringFieldUpdateOperationsInput | string | null
    ssma_timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: string
    seq?: number | null
    ledger?: string | null
    transNo?: string | null
    code?: string | null
    accountNumber?: string | null
    date?: Date | string | null
    invoiceNumber?: string | null
    particulars?: string | null
    debit?: number | null
    credit?: number | null
    balance?: number | null
    checkAccountNumber?: string | null
    checkNumber?: string | null
    dateMatured?: Date | string | null
    accountName?: string | null
    bankName?: string | null
    bankBranch?: string | null
    user?: string | null
    isCoincide?: boolean | null
    dailyClosing?: number | null
    approval?: string | null
    ftToLedger?: string | null
    ftToAccount?: string | null
    ssma_timestamp?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    seq?: NullableIntFieldUpdateOperationsInput | number | null
    ledger?: NullableStringFieldUpdateOperationsInput | string | null
    transNo?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    accountNumber?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    particulars?: NullableStringFieldUpdateOperationsInput | string | null
    debit?: NullableFloatFieldUpdateOperationsInput | number | null
    credit?: NullableFloatFieldUpdateOperationsInput | number | null
    balance?: NullableFloatFieldUpdateOperationsInput | number | null
    checkAccountNumber?: NullableStringFieldUpdateOperationsInput | string | null
    checkNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateMatured?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accountName?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: NullableStringFieldUpdateOperationsInput | string | null
    bankBranch?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    isCoincide?: NullableBoolFieldUpdateOperationsInput | boolean | null
    dailyClosing?: NullableIntFieldUpdateOperationsInput | number | null
    approval?: NullableStringFieldUpdateOperationsInput | string | null
    ftToLedger?: NullableStringFieldUpdateOperationsInput | string | null
    ftToAccount?: NullableStringFieldUpdateOperationsInput | string | null
    ssma_timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    seq?: NullableIntFieldUpdateOperationsInput | number | null
    ledger?: NullableStringFieldUpdateOperationsInput | string | null
    transNo?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    accountNumber?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    invoiceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    particulars?: NullableStringFieldUpdateOperationsInput | string | null
    debit?: NullableFloatFieldUpdateOperationsInput | number | null
    credit?: NullableFloatFieldUpdateOperationsInput | number | null
    balance?: NullableFloatFieldUpdateOperationsInput | number | null
    checkAccountNumber?: NullableStringFieldUpdateOperationsInput | string | null
    checkNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateMatured?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accountName?: NullableStringFieldUpdateOperationsInput | string | null
    bankName?: NullableStringFieldUpdateOperationsInput | string | null
    bankBranch?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    isCoincide?: NullableBoolFieldUpdateOperationsInput | boolean | null
    dailyClosing?: NullableIntFieldUpdateOperationsInput | number | null
    approval?: NullableStringFieldUpdateOperationsInput | string | null
    ftToLedger?: NullableStringFieldUpdateOperationsInput | string | null
    ftToAccount?: NullableStringFieldUpdateOperationsInput | string | null
    ssma_timestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointSettingCreateInput = {
    id?: string
    description: string
    amount?: number
    equivalentPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    loyaltyPoints?: LoyaltyPointCreateNestedManyWithoutPointSettingInput
  }

  export type LoyaltyPointSettingUncheckedCreateInput = {
    id?: string
    description: string
    amount?: number
    equivalentPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    loyaltyPoints?: LoyaltyPointUncheckedCreateNestedManyWithoutPointSettingInput
  }

  export type LoyaltyPointSettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    equivalentPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loyaltyPoints?: LoyaltyPointUpdateManyWithoutPointSettingNestedInput
  }

  export type LoyaltyPointSettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    equivalentPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loyaltyPoints?: LoyaltyPointUncheckedUpdateManyWithoutPointSettingNestedInput
  }

  export type LoyaltyPointSettingCreateManyInput = {
    id?: string
    description: string
    amount?: number
    equivalentPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPointSettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    equivalentPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointSettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    equivalentPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerCreateInput = {
    id?: string
    code: string
    customerName: string
    contactFirstName?: string | null
    address?: string | null
    phonePrimary?: string | null
    phoneAlternative?: string | null
    email?: string | null
    isActive?: boolean
    creditLimit?: number | null
    isTaxExempt?: boolean
    paymentTerms?: string | null
    paymentTermsValue?: string | null
    salesperson?: string | null
    customerGroup?: string | null
    isEntitledToLoyaltyPoints?: boolean
    pointSetting?: string | null
    loyaltyCalculationMethod?: string | null
    loyaltyCardNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    loyaltyPoints?: LoyaltyPointCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    code: string
    customerName: string
    contactFirstName?: string | null
    address?: string | null
    phonePrimary?: string | null
    phoneAlternative?: string | null
    email?: string | null
    isActive?: boolean
    creditLimit?: number | null
    isTaxExempt?: boolean
    paymentTerms?: string | null
    paymentTermsValue?: string | null
    salesperson?: string | null
    customerGroup?: string | null
    isEntitledToLoyaltyPoints?: boolean
    pointSetting?: string | null
    loyaltyCalculationMethod?: string | null
    loyaltyCardNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    loyaltyPoints?: LoyaltyPointUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    contactFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phonePrimary?: NullableStringFieldUpdateOperationsInput | string | null
    phoneAlternative?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    creditLimit?: NullableFloatFieldUpdateOperationsInput | number | null
    isTaxExempt?: BoolFieldUpdateOperationsInput | boolean
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsValue?: NullableStringFieldUpdateOperationsInput | string | null
    salesperson?: NullableStringFieldUpdateOperationsInput | string | null
    customerGroup?: NullableStringFieldUpdateOperationsInput | string | null
    isEntitledToLoyaltyPoints?: BoolFieldUpdateOperationsInput | boolean
    pointSetting?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCalculationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loyaltyPoints?: LoyaltyPointUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    contactFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phonePrimary?: NullableStringFieldUpdateOperationsInput | string | null
    phoneAlternative?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    creditLimit?: NullableFloatFieldUpdateOperationsInput | number | null
    isTaxExempt?: BoolFieldUpdateOperationsInput | boolean
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsValue?: NullableStringFieldUpdateOperationsInput | string | null
    salesperson?: NullableStringFieldUpdateOperationsInput | string | null
    customerGroup?: NullableStringFieldUpdateOperationsInput | string | null
    isEntitledToLoyaltyPoints?: BoolFieldUpdateOperationsInput | boolean
    pointSetting?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCalculationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    loyaltyPoints?: LoyaltyPointUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    code: string
    customerName: string
    contactFirstName?: string | null
    address?: string | null
    phonePrimary?: string | null
    phoneAlternative?: string | null
    email?: string | null
    isActive?: boolean
    creditLimit?: number | null
    isTaxExempt?: boolean
    paymentTerms?: string | null
    paymentTermsValue?: string | null
    salesperson?: string | null
    customerGroup?: string | null
    isEntitledToLoyaltyPoints?: boolean
    pointSetting?: string | null
    loyaltyCalculationMethod?: string | null
    loyaltyCardNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    contactFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phonePrimary?: NullableStringFieldUpdateOperationsInput | string | null
    phoneAlternative?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    creditLimit?: NullableFloatFieldUpdateOperationsInput | number | null
    isTaxExempt?: BoolFieldUpdateOperationsInput | boolean
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsValue?: NullableStringFieldUpdateOperationsInput | string | null
    salesperson?: NullableStringFieldUpdateOperationsInput | string | null
    customerGroup?: NullableStringFieldUpdateOperationsInput | string | null
    isEntitledToLoyaltyPoints?: BoolFieldUpdateOperationsInput | boolean
    pointSetting?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCalculationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    contactFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phonePrimary?: NullableStringFieldUpdateOperationsInput | string | null
    phoneAlternative?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    creditLimit?: NullableFloatFieldUpdateOperationsInput | number | null
    isTaxExempt?: BoolFieldUpdateOperationsInput | boolean
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsValue?: NullableStringFieldUpdateOperationsInput | string | null
    salesperson?: NullableStringFieldUpdateOperationsInput | string | null
    customerGroup?: NullableStringFieldUpdateOperationsInput | string | null
    isEntitledToLoyaltyPoints?: BoolFieldUpdateOperationsInput | boolean
    pointSetting?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCalculationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointCreateInput = {
    id?: string
    loyaltyCardId: string
    totalPoints?: number
    expiryDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutLoyaltyPointsInput
    pointSetting: LoyaltyPointSettingCreateNestedOneWithoutLoyaltyPointsInput
  }

  export type LoyaltyPointUncheckedCreateInput = {
    id?: string
    customerId: string
    loyaltyCardId: string
    totalPoints?: number
    pointSettingId: string
    expiryDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPointUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutLoyaltyPointsNestedInput
    pointSetting?: LoyaltyPointSettingUpdateOneRequiredWithoutLoyaltyPointsNestedInput
  }

  export type LoyaltyPointUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    pointSettingId?: StringFieldUpdateOperationsInput | string
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointCreateManyInput = {
    id?: string
    customerId: string
    loyaltyCardId: string
    totalPoints?: number
    pointSettingId: string
    expiryDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPointUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    pointSettingId?: StringFieldUpdateOperationsInput | string
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    code: string
    name: string
    barcode?: string | null
    description?: string | null
    additionalDescription?: string | null
    category?: string | null
    categoryId?: string | null
    subcategoryId?: string | null
    brandId?: string | null
    supplierId?: string | null
    unitOfMeasureId?: string | null
    unitPrice?: number
    costPrice?: number
    stockQuantity?: number
    minStockLevel?: number
    maxStockLevel?: number | null
    isActive?: boolean
    salesOrder?: string | null
    autoCreateChildren?: boolean
    initialStock?: number
    reorderPoint?: number
    incomeAccountId?: string | null
    expenseAccountId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    barcode?: string | null
    description?: string | null
    additionalDescription?: string | null
    category?: string | null
    categoryId?: string | null
    subcategoryId?: string | null
    brandId?: string | null
    supplierId?: string | null
    unitOfMeasureId?: string | null
    unitPrice?: number
    costPrice?: number
    stockQuantity?: number
    minStockLevel?: number
    maxStockLevel?: number | null
    isActive?: boolean
    salesOrder?: string | null
    autoCreateChildren?: boolean
    initialStock?: number
    reorderPoint?: number
    incomeAccountId?: string | null
    expenseAccountId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    additionalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    supplierId?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasureId?: NullableStringFieldUpdateOperationsInput | string | null
    unitPrice?: FloatFieldUpdateOperationsInput | number
    costPrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: IntFieldUpdateOperationsInput | number
    minStockLevel?: IntFieldUpdateOperationsInput | number
    maxStockLevel?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    salesOrder?: NullableStringFieldUpdateOperationsInput | string | null
    autoCreateChildren?: BoolFieldUpdateOperationsInput | boolean
    initialStock?: IntFieldUpdateOperationsInput | number
    reorderPoint?: IntFieldUpdateOperationsInput | number
    incomeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    additionalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    supplierId?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasureId?: NullableStringFieldUpdateOperationsInput | string | null
    unitPrice?: FloatFieldUpdateOperationsInput | number
    costPrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: IntFieldUpdateOperationsInput | number
    minStockLevel?: IntFieldUpdateOperationsInput | number
    maxStockLevel?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    salesOrder?: NullableStringFieldUpdateOperationsInput | string | null
    autoCreateChildren?: BoolFieldUpdateOperationsInput | boolean
    initialStock?: IntFieldUpdateOperationsInput | number
    reorderPoint?: IntFieldUpdateOperationsInput | number
    incomeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateManyInput = {
    id?: string
    code: string
    name: string
    barcode?: string | null
    description?: string | null
    additionalDescription?: string | null
    category?: string | null
    categoryId?: string | null
    subcategoryId?: string | null
    brandId?: string | null
    supplierId?: string | null
    unitOfMeasureId?: string | null
    unitPrice?: number
    costPrice?: number
    stockQuantity?: number
    minStockLevel?: number
    maxStockLevel?: number | null
    isActive?: boolean
    salesOrder?: string | null
    autoCreateChildren?: boolean
    initialStock?: number
    reorderPoint?: number
    incomeAccountId?: string | null
    expenseAccountId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    additionalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    supplierId?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasureId?: NullableStringFieldUpdateOperationsInput | string | null
    unitPrice?: FloatFieldUpdateOperationsInput | number
    costPrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: IntFieldUpdateOperationsInput | number
    minStockLevel?: IntFieldUpdateOperationsInput | number
    maxStockLevel?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    salesOrder?: NullableStringFieldUpdateOperationsInput | string | null
    autoCreateChildren?: BoolFieldUpdateOperationsInput | boolean
    initialStock?: IntFieldUpdateOperationsInput | number
    reorderPoint?: IntFieldUpdateOperationsInput | number
    incomeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    additionalDescription?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    supplierId?: NullableStringFieldUpdateOperationsInput | string | null
    unitOfMeasureId?: NullableStringFieldUpdateOperationsInput | string | null
    unitPrice?: FloatFieldUpdateOperationsInput | number
    costPrice?: FloatFieldUpdateOperationsInput | number
    stockQuantity?: IntFieldUpdateOperationsInput | number
    minStockLevel?: IntFieldUpdateOperationsInput | number
    maxStockLevel?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    salesOrder?: NullableStringFieldUpdateOperationsInput | string | null
    autoCreateChildren?: BoolFieldUpdateOperationsInput | boolean
    initialStock?: IntFieldUpdateOperationsInput | number
    reorderPoint?: IntFieldUpdateOperationsInput | number
    incomeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversionFactorCreateInput = {
    id?: string
    productId: string
    unitName: string
    factor: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversionFactorUncheckedCreateInput = {
    id?: string
    productId: string
    unitName: string
    factor: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversionFactorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    unitName?: StringFieldUpdateOperationsInput | string
    factor?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversionFactorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    unitName?: StringFieldUpdateOperationsInput | string
    factor?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversionFactorCreateManyInput = {
    id?: string
    productId: string
    unitName: string
    factor: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversionFactorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    unitName?: StringFieldUpdateOperationsInput | string
    factor?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversionFactorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    unitName?: StringFieldUpdateOperationsInput | string
    factor?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BrandCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BrandUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BrandUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BrandUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BrandCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BrandUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BrandUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    id?: string
    name: string
    description?: string | null
    parentCategoryId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    parentCategoryId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    parentCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    parentCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    parentCategoryId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    parentCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    parentCategoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierCreateInput = {
    id?: string
    name: string
    contactPerson?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierUncheckedCreateInput = {
    id?: string
    name: string
    contactPerson?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierCreateManyInput = {
    id?: string
    name: string
    contactPerson?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    paymentTerms?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnitOfMeasureCreateInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnitOfMeasureUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnitOfMeasureUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnitOfMeasureUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnitOfMeasureCreateManyInput = {
    id?: string
    code: string
    name: string
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnitOfMeasureUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnitOfMeasureUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderCreateInput = {
    id?: string
    title: string
    memo?: string | null
    date: Date | string
    endDate?: Date | string | null
    isActive?: boolean
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReminderUncheckedCreateInput = {
    id?: string
    title: string
    memo?: string | null
    date: Date | string
    endDate?: Date | string | null
    isActive?: boolean
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReminderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderCreateManyInput = {
    id?: string
    title: string
    memo?: string | null
    date: Date | string
    endDate?: Date | string | null
    isActive?: boolean
    isRead?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReminderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReminderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesUserCreateInput = {
    id?: string
    name: string
    uniqueId: string
    username?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesUserUncheckedCreateInput = {
    id?: string
    name: string
    uniqueId: string
    username?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uniqueId?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uniqueId?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesUserCreateManyInput = {
    id?: string
    name: string
    uniqueId: string
    username?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uniqueId?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    uniqueId?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionCreateInput = {
    id?: string
    username: string
    firstName: string
    middleName?: string | null
    lastName: string
    designation: string
    userAccess: string
    contactNo?: string | null
    accountType: string
    password?: string | null
    permissions: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPermissionUncheckedCreateInput = {
    id?: string
    username: string
    firstName: string
    middleName?: string | null
    lastName: string
    designation: string
    userAccess: string
    contactNo?: string | null
    accountType: string
    password?: string | null
    permissions: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPermissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    userAccess?: StringFieldUpdateOperationsInput | string
    contactNo?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    userAccess?: StringFieldUpdateOperationsInput | string
    contactNo?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionCreateManyInput = {
    id?: string
    username: string
    firstName: string
    middleName?: string | null
    lastName: string
    designation: string
    userAccess: string
    contactNo?: string | null
    accountType: string
    password?: string | null
    permissions: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserPermissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    userAccess?: StringFieldUpdateOperationsInput | string
    contactNo?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: StringFieldUpdateOperationsInput | string
    designation?: StringFieldUpdateOperationsInput | string
    userAccess?: StringFieldUpdateOperationsInput | string
    contactNo?: NullableStringFieldUpdateOperationsInput | string | null
    accountType?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BusinessProfileCreateInput = {
    id?: string
    businessName: string
    address?: string | null
    owner?: string | null
    contactPhone?: string | null
    contactTel?: string | null
    email?: string | null
    tin?: string | null
    permit?: string | null
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BusinessProfileUncheckedCreateInput = {
    id?: string
    businessName: string
    address?: string | null
    owner?: string | null
    contactPhone?: string | null
    contactTel?: string | null
    email?: string | null
    tin?: string | null
    permit?: string | null
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BusinessProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactTel?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    permit?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BusinessProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactTel?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    permit?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BusinessProfileCreateManyInput = {
    id?: string
    businessName: string
    address?: string | null
    owner?: string | null
    contactPhone?: string | null
    contactTel?: string | null
    email?: string | null
    tin?: string | null
    permit?: string | null
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BusinessProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactTel?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    permit?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BusinessProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactTel?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tin?: NullableStringFieldUpdateOperationsInput | string | null
    permit?: NullableStringFieldUpdateOperationsInput | string | null
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupScheduleCreateInput = {
    id?: string
    backupTime: Date | string
    frequency: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupScheduleUncheckedCreateInput = {
    id?: string
    backupTime: Date | string
    frequency: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    backupTime?: DateTimeFieldUpdateOperationsInput | Date | string
    frequency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    backupTime?: DateTimeFieldUpdateOperationsInput | Date | string
    frequency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupScheduleCreateManyInput = {
    id?: string
    backupTime: Date | string
    frequency: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackupScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    backupTime?: DateTimeFieldUpdateOperationsInput | Date | string
    frequency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackupScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    backupTime?: DateTimeFieldUpdateOperationsInput | Date | string
    frequency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    type: string
    title: string
    message?: string | null
    entityId?: string | null
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    type: string
    title: string
    message?: string | null
    entityId?: string | null
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    type: string
    title: string
    message?: string | null
    entityId?: string | null
    isRead?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelevanceInput = {
    fields: AccountOrderByRelevanceFieldEnum | AccountOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accnt_no?: SortOrder
    accnt_type_no?: SortOrder
    name?: SortOrder
    balance?: SortOrder
    type?: SortOrder
    header?: SortOrder
    bank?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    accnt_no?: SortOrder
    accnt_type_no?: SortOrder
    balance?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accnt_no?: SortOrder
    accnt_type_no?: SortOrder
    name?: SortOrder
    balance?: SortOrder
    type?: SortOrder
    header?: SortOrder
    bank?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accnt_no?: SortOrder
    accnt_type_no?: SortOrder
    name?: SortOrder
    balance?: SortOrder
    type?: SortOrder
    header?: SortOrder
    bank?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    accnt_no?: SortOrder
    accnt_type_no?: SortOrder
    balance?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type TransactionOrderByRelevanceInput = {
    fields: TransactionOrderByRelevanceFieldEnum | TransactionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    seq?: SortOrder
    ledger?: SortOrder
    transNo?: SortOrder
    code?: SortOrder
    accountNumber?: SortOrder
    date?: SortOrder
    invoiceNumber?: SortOrder
    particulars?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    balance?: SortOrder
    checkAccountNumber?: SortOrder
    checkNumber?: SortOrder
    dateMatured?: SortOrder
    accountName?: SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    user?: SortOrder
    isCoincide?: SortOrder
    dailyClosing?: SortOrder
    approval?: SortOrder
    ftToLedger?: SortOrder
    ftToAccount?: SortOrder
    ssma_timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    seq?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    balance?: SortOrder
    dailyClosing?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    seq?: SortOrder
    ledger?: SortOrder
    transNo?: SortOrder
    code?: SortOrder
    accountNumber?: SortOrder
    date?: SortOrder
    invoiceNumber?: SortOrder
    particulars?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    balance?: SortOrder
    checkAccountNumber?: SortOrder
    checkNumber?: SortOrder
    dateMatured?: SortOrder
    accountName?: SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    user?: SortOrder
    isCoincide?: SortOrder
    dailyClosing?: SortOrder
    approval?: SortOrder
    ftToLedger?: SortOrder
    ftToAccount?: SortOrder
    ssma_timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    seq?: SortOrder
    ledger?: SortOrder
    transNo?: SortOrder
    code?: SortOrder
    accountNumber?: SortOrder
    date?: SortOrder
    invoiceNumber?: SortOrder
    particulars?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    balance?: SortOrder
    checkAccountNumber?: SortOrder
    checkNumber?: SortOrder
    dateMatured?: SortOrder
    accountName?: SortOrder
    bankName?: SortOrder
    bankBranch?: SortOrder
    user?: SortOrder
    isCoincide?: SortOrder
    dailyClosing?: SortOrder
    approval?: SortOrder
    ftToLedger?: SortOrder
    ftToAccount?: SortOrder
    ssma_timestamp?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    seq?: SortOrder
    debit?: SortOrder
    credit?: SortOrder
    balance?: SortOrder
    dailyClosing?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type LoyaltyPointListRelationFilter = {
    every?: LoyaltyPointWhereInput
    some?: LoyaltyPointWhereInput
    none?: LoyaltyPointWhereInput
  }

  export type LoyaltyPointOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LoyaltyPointSettingOrderByRelevanceInput = {
    fields: LoyaltyPointSettingOrderByRelevanceFieldEnum | LoyaltyPointSettingOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LoyaltyPointSettingCountOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    equivalentPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyPointSettingAvgOrderByAggregateInput = {
    amount?: SortOrder
    equivalentPoint?: SortOrder
  }

  export type LoyaltyPointSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    equivalentPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyPointSettingMinOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    equivalentPoint?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyPointSettingSumOrderByAggregateInput = {
    amount?: SortOrder
    equivalentPoint?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CustomerOrderByRelevanceInput = {
    fields: CustomerOrderByRelevanceFieldEnum | CustomerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    customerName?: SortOrder
    contactFirstName?: SortOrder
    address?: SortOrder
    phonePrimary?: SortOrder
    phoneAlternative?: SortOrder
    email?: SortOrder
    isActive?: SortOrder
    creditLimit?: SortOrder
    isTaxExempt?: SortOrder
    paymentTerms?: SortOrder
    paymentTermsValue?: SortOrder
    salesperson?: SortOrder
    customerGroup?: SortOrder
    isEntitledToLoyaltyPoints?: SortOrder
    pointSetting?: SortOrder
    loyaltyCalculationMethod?: SortOrder
    loyaltyCardNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerAvgOrderByAggregateInput = {
    creditLimit?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    customerName?: SortOrder
    contactFirstName?: SortOrder
    address?: SortOrder
    phonePrimary?: SortOrder
    phoneAlternative?: SortOrder
    email?: SortOrder
    isActive?: SortOrder
    creditLimit?: SortOrder
    isTaxExempt?: SortOrder
    paymentTerms?: SortOrder
    paymentTermsValue?: SortOrder
    salesperson?: SortOrder
    customerGroup?: SortOrder
    isEntitledToLoyaltyPoints?: SortOrder
    pointSetting?: SortOrder
    loyaltyCalculationMethod?: SortOrder
    loyaltyCardNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    customerName?: SortOrder
    contactFirstName?: SortOrder
    address?: SortOrder
    phonePrimary?: SortOrder
    phoneAlternative?: SortOrder
    email?: SortOrder
    isActive?: SortOrder
    creditLimit?: SortOrder
    isTaxExempt?: SortOrder
    paymentTerms?: SortOrder
    paymentTermsValue?: SortOrder
    salesperson?: SortOrder
    customerGroup?: SortOrder
    isEntitledToLoyaltyPoints?: SortOrder
    pointSetting?: SortOrder
    loyaltyCalculationMethod?: SortOrder
    loyaltyCardNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerSumOrderByAggregateInput = {
    creditLimit?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CustomerScalarRelationFilter = {
    is?: CustomerWhereInput
    isNot?: CustomerWhereInput
  }

  export type LoyaltyPointSettingScalarRelationFilter = {
    is?: LoyaltyPointSettingWhereInput
    isNot?: LoyaltyPointSettingWhereInput
  }

  export type LoyaltyPointOrderByRelevanceInput = {
    fields: LoyaltyPointOrderByRelevanceFieldEnum | LoyaltyPointOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LoyaltyPointCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    loyaltyCardId?: SortOrder
    totalPoints?: SortOrder
    pointSettingId?: SortOrder
    expiryDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyPointAvgOrderByAggregateInput = {
    totalPoints?: SortOrder
  }

  export type LoyaltyPointMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    loyaltyCardId?: SortOrder
    totalPoints?: SortOrder
    pointSettingId?: SortOrder
    expiryDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyPointMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    loyaltyCardId?: SortOrder
    totalPoints?: SortOrder
    pointSettingId?: SortOrder
    expiryDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyPointSumOrderByAggregateInput = {
    totalPoints?: SortOrder
  }

  export type ProductOrderByRelevanceInput = {
    fields: ProductOrderByRelevanceFieldEnum | ProductOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    barcode?: SortOrder
    description?: SortOrder
    additionalDescription?: SortOrder
    category?: SortOrder
    categoryId?: SortOrder
    subcategoryId?: SortOrder
    brandId?: SortOrder
    supplierId?: SortOrder
    unitOfMeasureId?: SortOrder
    unitPrice?: SortOrder
    costPrice?: SortOrder
    stockQuantity?: SortOrder
    minStockLevel?: SortOrder
    maxStockLevel?: SortOrder
    isActive?: SortOrder
    salesOrder?: SortOrder
    autoCreateChildren?: SortOrder
    initialStock?: SortOrder
    reorderPoint?: SortOrder
    incomeAccountId?: SortOrder
    expenseAccountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    unitPrice?: SortOrder
    costPrice?: SortOrder
    stockQuantity?: SortOrder
    minStockLevel?: SortOrder
    maxStockLevel?: SortOrder
    initialStock?: SortOrder
    reorderPoint?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    barcode?: SortOrder
    description?: SortOrder
    additionalDescription?: SortOrder
    category?: SortOrder
    categoryId?: SortOrder
    subcategoryId?: SortOrder
    brandId?: SortOrder
    supplierId?: SortOrder
    unitOfMeasureId?: SortOrder
    unitPrice?: SortOrder
    costPrice?: SortOrder
    stockQuantity?: SortOrder
    minStockLevel?: SortOrder
    maxStockLevel?: SortOrder
    isActive?: SortOrder
    salesOrder?: SortOrder
    autoCreateChildren?: SortOrder
    initialStock?: SortOrder
    reorderPoint?: SortOrder
    incomeAccountId?: SortOrder
    expenseAccountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    barcode?: SortOrder
    description?: SortOrder
    additionalDescription?: SortOrder
    category?: SortOrder
    categoryId?: SortOrder
    subcategoryId?: SortOrder
    brandId?: SortOrder
    supplierId?: SortOrder
    unitOfMeasureId?: SortOrder
    unitPrice?: SortOrder
    costPrice?: SortOrder
    stockQuantity?: SortOrder
    minStockLevel?: SortOrder
    maxStockLevel?: SortOrder
    isActive?: SortOrder
    salesOrder?: SortOrder
    autoCreateChildren?: SortOrder
    initialStock?: SortOrder
    reorderPoint?: SortOrder
    incomeAccountId?: SortOrder
    expenseAccountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    unitPrice?: SortOrder
    costPrice?: SortOrder
    stockQuantity?: SortOrder
    minStockLevel?: SortOrder
    maxStockLevel?: SortOrder
    initialStock?: SortOrder
    reorderPoint?: SortOrder
  }

  export type ConversionFactorOrderByRelevanceInput = {
    fields: ConversionFactorOrderByRelevanceFieldEnum | ConversionFactorOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ConversionFactorCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    unitName?: SortOrder
    factor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversionFactorAvgOrderByAggregateInput = {
    factor?: SortOrder
  }

  export type ConversionFactorMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    unitName?: SortOrder
    factor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversionFactorMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    unitName?: SortOrder
    factor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversionFactorSumOrderByAggregateInput = {
    factor?: SortOrder
  }

  export type BrandOrderByRelevanceInput = {
    fields: BrandOrderByRelevanceFieldEnum | BrandOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BrandCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BrandMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BrandMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryOrderByRelevanceInput = {
    fields: CategoryOrderByRelevanceFieldEnum | CategoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    parentCategoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    parentCategoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    parentCategoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierOrderByRelevanceInput = {
    fields: SupplierOrderByRelevanceFieldEnum | SupplierOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SupplierCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    paymentTerms?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    paymentTerms?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    contactPerson?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    paymentTerms?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnitOfMeasureOrderByRelevanceInput = {
    fields: UnitOfMeasureOrderByRelevanceFieldEnum | UnitOfMeasureOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UnitOfMeasureCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnitOfMeasureMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnitOfMeasureMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReminderOrderByRelevanceInput = {
    fields: ReminderOrderByRelevanceFieldEnum | ReminderOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ReminderCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    memo?: SortOrder
    date?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReminderMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    memo?: SortOrder
    date?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReminderMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    memo?: SortOrder
    date?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesUserOrderByRelevanceInput = {
    fields: SalesUserOrderByRelevanceFieldEnum | SalesUserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SalesUserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uniqueId?: SortOrder
    username?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesUserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uniqueId?: SortOrder
    username?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesUserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    uniqueId?: SortOrder
    username?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserPermissionOrderByRelevanceInput = {
    fields: UserPermissionOrderByRelevanceFieldEnum | UserPermissionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserPermissionCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    middleName?: SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    userAccess?: SortOrder
    contactNo?: SortOrder
    accountType?: SortOrder
    password?: SortOrder
    permissions?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserPermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    middleName?: SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    userAccess?: SortOrder
    contactNo?: SortOrder
    accountType?: SortOrder
    password?: SortOrder
    permissions?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserPermissionMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    middleName?: SortOrder
    lastName?: SortOrder
    designation?: SortOrder
    userAccess?: SortOrder
    contactNo?: SortOrder
    accountType?: SortOrder
    password?: SortOrder
    permissions?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BusinessProfileOrderByRelevanceInput = {
    fields: BusinessProfileOrderByRelevanceFieldEnum | BusinessProfileOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BusinessProfileCountOrderByAggregateInput = {
    id?: SortOrder
    businessName?: SortOrder
    address?: SortOrder
    owner?: SortOrder
    contactPhone?: SortOrder
    contactTel?: SortOrder
    email?: SortOrder
    tin?: SortOrder
    permit?: SortOrder
    logo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BusinessProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    businessName?: SortOrder
    address?: SortOrder
    owner?: SortOrder
    contactPhone?: SortOrder
    contactTel?: SortOrder
    email?: SortOrder
    tin?: SortOrder
    permit?: SortOrder
    logo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BusinessProfileMinOrderByAggregateInput = {
    id?: SortOrder
    businessName?: SortOrder
    address?: SortOrder
    owner?: SortOrder
    contactPhone?: SortOrder
    contactTel?: SortOrder
    email?: SortOrder
    tin?: SortOrder
    permit?: SortOrder
    logo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupScheduleOrderByRelevanceInput = {
    fields: BackupScheduleOrderByRelevanceFieldEnum | BackupScheduleOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BackupScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    backupTime?: SortOrder
    frequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    backupTime?: SortOrder
    frequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackupScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    backupTime?: SortOrder
    frequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationOrderByRelevanceInput = {
    fields: NotificationOrderByRelevanceFieldEnum | NotificationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    entityId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    entityId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    message?: SortOrder
    entityId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type LoyaltyPointCreateNestedManyWithoutPointSettingInput = {
    create?: XOR<LoyaltyPointCreateWithoutPointSettingInput, LoyaltyPointUncheckedCreateWithoutPointSettingInput> | LoyaltyPointCreateWithoutPointSettingInput[] | LoyaltyPointUncheckedCreateWithoutPointSettingInput[]
    connectOrCreate?: LoyaltyPointCreateOrConnectWithoutPointSettingInput | LoyaltyPointCreateOrConnectWithoutPointSettingInput[]
    createMany?: LoyaltyPointCreateManyPointSettingInputEnvelope
    connect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
  }

  export type LoyaltyPointUncheckedCreateNestedManyWithoutPointSettingInput = {
    create?: XOR<LoyaltyPointCreateWithoutPointSettingInput, LoyaltyPointUncheckedCreateWithoutPointSettingInput> | LoyaltyPointCreateWithoutPointSettingInput[] | LoyaltyPointUncheckedCreateWithoutPointSettingInput[]
    connectOrCreate?: LoyaltyPointCreateOrConnectWithoutPointSettingInput | LoyaltyPointCreateOrConnectWithoutPointSettingInput[]
    createMany?: LoyaltyPointCreateManyPointSettingInputEnvelope
    connect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LoyaltyPointUpdateManyWithoutPointSettingNestedInput = {
    create?: XOR<LoyaltyPointCreateWithoutPointSettingInput, LoyaltyPointUncheckedCreateWithoutPointSettingInput> | LoyaltyPointCreateWithoutPointSettingInput[] | LoyaltyPointUncheckedCreateWithoutPointSettingInput[]
    connectOrCreate?: LoyaltyPointCreateOrConnectWithoutPointSettingInput | LoyaltyPointCreateOrConnectWithoutPointSettingInput[]
    upsert?: LoyaltyPointUpsertWithWhereUniqueWithoutPointSettingInput | LoyaltyPointUpsertWithWhereUniqueWithoutPointSettingInput[]
    createMany?: LoyaltyPointCreateManyPointSettingInputEnvelope
    set?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    disconnect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    delete?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    connect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    update?: LoyaltyPointUpdateWithWhereUniqueWithoutPointSettingInput | LoyaltyPointUpdateWithWhereUniqueWithoutPointSettingInput[]
    updateMany?: LoyaltyPointUpdateManyWithWhereWithoutPointSettingInput | LoyaltyPointUpdateManyWithWhereWithoutPointSettingInput[]
    deleteMany?: LoyaltyPointScalarWhereInput | LoyaltyPointScalarWhereInput[]
  }

  export type LoyaltyPointUncheckedUpdateManyWithoutPointSettingNestedInput = {
    create?: XOR<LoyaltyPointCreateWithoutPointSettingInput, LoyaltyPointUncheckedCreateWithoutPointSettingInput> | LoyaltyPointCreateWithoutPointSettingInput[] | LoyaltyPointUncheckedCreateWithoutPointSettingInput[]
    connectOrCreate?: LoyaltyPointCreateOrConnectWithoutPointSettingInput | LoyaltyPointCreateOrConnectWithoutPointSettingInput[]
    upsert?: LoyaltyPointUpsertWithWhereUniqueWithoutPointSettingInput | LoyaltyPointUpsertWithWhereUniqueWithoutPointSettingInput[]
    createMany?: LoyaltyPointCreateManyPointSettingInputEnvelope
    set?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    disconnect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    delete?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    connect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    update?: LoyaltyPointUpdateWithWhereUniqueWithoutPointSettingInput | LoyaltyPointUpdateWithWhereUniqueWithoutPointSettingInput[]
    updateMany?: LoyaltyPointUpdateManyWithWhereWithoutPointSettingInput | LoyaltyPointUpdateManyWithWhereWithoutPointSettingInput[]
    deleteMany?: LoyaltyPointScalarWhereInput | LoyaltyPointScalarWhereInput[]
  }

  export type LoyaltyPointCreateNestedManyWithoutCustomerInput = {
    create?: XOR<LoyaltyPointCreateWithoutCustomerInput, LoyaltyPointUncheckedCreateWithoutCustomerInput> | LoyaltyPointCreateWithoutCustomerInput[] | LoyaltyPointUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: LoyaltyPointCreateOrConnectWithoutCustomerInput | LoyaltyPointCreateOrConnectWithoutCustomerInput[]
    createMany?: LoyaltyPointCreateManyCustomerInputEnvelope
    connect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
  }

  export type LoyaltyPointUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<LoyaltyPointCreateWithoutCustomerInput, LoyaltyPointUncheckedCreateWithoutCustomerInput> | LoyaltyPointCreateWithoutCustomerInput[] | LoyaltyPointUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: LoyaltyPointCreateOrConnectWithoutCustomerInput | LoyaltyPointCreateOrConnectWithoutCustomerInput[]
    createMany?: LoyaltyPointCreateManyCustomerInputEnvelope
    connect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type LoyaltyPointUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<LoyaltyPointCreateWithoutCustomerInput, LoyaltyPointUncheckedCreateWithoutCustomerInput> | LoyaltyPointCreateWithoutCustomerInput[] | LoyaltyPointUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: LoyaltyPointCreateOrConnectWithoutCustomerInput | LoyaltyPointCreateOrConnectWithoutCustomerInput[]
    upsert?: LoyaltyPointUpsertWithWhereUniqueWithoutCustomerInput | LoyaltyPointUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: LoyaltyPointCreateManyCustomerInputEnvelope
    set?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    disconnect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    delete?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    connect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    update?: LoyaltyPointUpdateWithWhereUniqueWithoutCustomerInput | LoyaltyPointUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: LoyaltyPointUpdateManyWithWhereWithoutCustomerInput | LoyaltyPointUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: LoyaltyPointScalarWhereInput | LoyaltyPointScalarWhereInput[]
  }

  export type LoyaltyPointUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<LoyaltyPointCreateWithoutCustomerInput, LoyaltyPointUncheckedCreateWithoutCustomerInput> | LoyaltyPointCreateWithoutCustomerInput[] | LoyaltyPointUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: LoyaltyPointCreateOrConnectWithoutCustomerInput | LoyaltyPointCreateOrConnectWithoutCustomerInput[]
    upsert?: LoyaltyPointUpsertWithWhereUniqueWithoutCustomerInput | LoyaltyPointUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: LoyaltyPointCreateManyCustomerInputEnvelope
    set?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    disconnect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    delete?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    connect?: LoyaltyPointWhereUniqueInput | LoyaltyPointWhereUniqueInput[]
    update?: LoyaltyPointUpdateWithWhereUniqueWithoutCustomerInput | LoyaltyPointUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: LoyaltyPointUpdateManyWithWhereWithoutCustomerInput | LoyaltyPointUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: LoyaltyPointScalarWhereInput | LoyaltyPointScalarWhereInput[]
  }

  export type CustomerCreateNestedOneWithoutLoyaltyPointsInput = {
    create?: XOR<CustomerCreateWithoutLoyaltyPointsInput, CustomerUncheckedCreateWithoutLoyaltyPointsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutLoyaltyPointsInput
    connect?: CustomerWhereUniqueInput
  }

  export type LoyaltyPointSettingCreateNestedOneWithoutLoyaltyPointsInput = {
    create?: XOR<LoyaltyPointSettingCreateWithoutLoyaltyPointsInput, LoyaltyPointSettingUncheckedCreateWithoutLoyaltyPointsInput>
    connectOrCreate?: LoyaltyPointSettingCreateOrConnectWithoutLoyaltyPointsInput
    connect?: LoyaltyPointSettingWhereUniqueInput
  }

  export type CustomerUpdateOneRequiredWithoutLoyaltyPointsNestedInput = {
    create?: XOR<CustomerCreateWithoutLoyaltyPointsInput, CustomerUncheckedCreateWithoutLoyaltyPointsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutLoyaltyPointsInput
    upsert?: CustomerUpsertWithoutLoyaltyPointsInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutLoyaltyPointsInput, CustomerUpdateWithoutLoyaltyPointsInput>, CustomerUncheckedUpdateWithoutLoyaltyPointsInput>
  }

  export type LoyaltyPointSettingUpdateOneRequiredWithoutLoyaltyPointsNestedInput = {
    create?: XOR<LoyaltyPointSettingCreateWithoutLoyaltyPointsInput, LoyaltyPointSettingUncheckedCreateWithoutLoyaltyPointsInput>
    connectOrCreate?: LoyaltyPointSettingCreateOrConnectWithoutLoyaltyPointsInput
    upsert?: LoyaltyPointSettingUpsertWithoutLoyaltyPointsInput
    connect?: LoyaltyPointSettingWhereUniqueInput
    update?: XOR<XOR<LoyaltyPointSettingUpdateToOneWithWhereWithoutLoyaltyPointsInput, LoyaltyPointSettingUpdateWithoutLoyaltyPointsInput>, LoyaltyPointSettingUncheckedUpdateWithoutLoyaltyPointsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type LoyaltyPointCreateWithoutPointSettingInput = {
    id?: string
    loyaltyCardId: string
    totalPoints?: number
    expiryDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutLoyaltyPointsInput
  }

  export type LoyaltyPointUncheckedCreateWithoutPointSettingInput = {
    id?: string
    customerId: string
    loyaltyCardId: string
    totalPoints?: number
    expiryDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPointCreateOrConnectWithoutPointSettingInput = {
    where: LoyaltyPointWhereUniqueInput
    create: XOR<LoyaltyPointCreateWithoutPointSettingInput, LoyaltyPointUncheckedCreateWithoutPointSettingInput>
  }

  export type LoyaltyPointCreateManyPointSettingInputEnvelope = {
    data: LoyaltyPointCreateManyPointSettingInput | LoyaltyPointCreateManyPointSettingInput[]
    skipDuplicates?: boolean
  }

  export type LoyaltyPointUpsertWithWhereUniqueWithoutPointSettingInput = {
    where: LoyaltyPointWhereUniqueInput
    update: XOR<LoyaltyPointUpdateWithoutPointSettingInput, LoyaltyPointUncheckedUpdateWithoutPointSettingInput>
    create: XOR<LoyaltyPointCreateWithoutPointSettingInput, LoyaltyPointUncheckedCreateWithoutPointSettingInput>
  }

  export type LoyaltyPointUpdateWithWhereUniqueWithoutPointSettingInput = {
    where: LoyaltyPointWhereUniqueInput
    data: XOR<LoyaltyPointUpdateWithoutPointSettingInput, LoyaltyPointUncheckedUpdateWithoutPointSettingInput>
  }

  export type LoyaltyPointUpdateManyWithWhereWithoutPointSettingInput = {
    where: LoyaltyPointScalarWhereInput
    data: XOR<LoyaltyPointUpdateManyMutationInput, LoyaltyPointUncheckedUpdateManyWithoutPointSettingInput>
  }

  export type LoyaltyPointScalarWhereInput = {
    AND?: LoyaltyPointScalarWhereInput | LoyaltyPointScalarWhereInput[]
    OR?: LoyaltyPointScalarWhereInput[]
    NOT?: LoyaltyPointScalarWhereInput | LoyaltyPointScalarWhereInput[]
    id?: StringFilter<"LoyaltyPoint"> | string
    customerId?: StringFilter<"LoyaltyPoint"> | string
    loyaltyCardId?: StringFilter<"LoyaltyPoint"> | string
    totalPoints?: FloatFilter<"LoyaltyPoint"> | number
    pointSettingId?: StringFilter<"LoyaltyPoint"> | string
    expiryDate?: DateTimeNullableFilter<"LoyaltyPoint"> | Date | string | null
    createdAt?: DateTimeFilter<"LoyaltyPoint"> | Date | string
    updatedAt?: DateTimeFilter<"LoyaltyPoint"> | Date | string
  }

  export type LoyaltyPointCreateWithoutCustomerInput = {
    id?: string
    loyaltyCardId: string
    totalPoints?: number
    expiryDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pointSetting: LoyaltyPointSettingCreateNestedOneWithoutLoyaltyPointsInput
  }

  export type LoyaltyPointUncheckedCreateWithoutCustomerInput = {
    id?: string
    loyaltyCardId: string
    totalPoints?: number
    pointSettingId: string
    expiryDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPointCreateOrConnectWithoutCustomerInput = {
    where: LoyaltyPointWhereUniqueInput
    create: XOR<LoyaltyPointCreateWithoutCustomerInput, LoyaltyPointUncheckedCreateWithoutCustomerInput>
  }

  export type LoyaltyPointCreateManyCustomerInputEnvelope = {
    data: LoyaltyPointCreateManyCustomerInput | LoyaltyPointCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type LoyaltyPointUpsertWithWhereUniqueWithoutCustomerInput = {
    where: LoyaltyPointWhereUniqueInput
    update: XOR<LoyaltyPointUpdateWithoutCustomerInput, LoyaltyPointUncheckedUpdateWithoutCustomerInput>
    create: XOR<LoyaltyPointCreateWithoutCustomerInput, LoyaltyPointUncheckedCreateWithoutCustomerInput>
  }

  export type LoyaltyPointUpdateWithWhereUniqueWithoutCustomerInput = {
    where: LoyaltyPointWhereUniqueInput
    data: XOR<LoyaltyPointUpdateWithoutCustomerInput, LoyaltyPointUncheckedUpdateWithoutCustomerInput>
  }

  export type LoyaltyPointUpdateManyWithWhereWithoutCustomerInput = {
    where: LoyaltyPointScalarWhereInput
    data: XOR<LoyaltyPointUpdateManyMutationInput, LoyaltyPointUncheckedUpdateManyWithoutCustomerInput>
  }

  export type CustomerCreateWithoutLoyaltyPointsInput = {
    id?: string
    code: string
    customerName: string
    contactFirstName?: string | null
    address?: string | null
    phonePrimary?: string | null
    phoneAlternative?: string | null
    email?: string | null
    isActive?: boolean
    creditLimit?: number | null
    isTaxExempt?: boolean
    paymentTerms?: string | null
    paymentTermsValue?: string | null
    salesperson?: string | null
    customerGroup?: string | null
    isEntitledToLoyaltyPoints?: boolean
    pointSetting?: string | null
    loyaltyCalculationMethod?: string | null
    loyaltyCardNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUncheckedCreateWithoutLoyaltyPointsInput = {
    id?: string
    code: string
    customerName: string
    contactFirstName?: string | null
    address?: string | null
    phonePrimary?: string | null
    phoneAlternative?: string | null
    email?: string | null
    isActive?: boolean
    creditLimit?: number | null
    isTaxExempt?: boolean
    paymentTerms?: string | null
    paymentTermsValue?: string | null
    salesperson?: string | null
    customerGroup?: string | null
    isEntitledToLoyaltyPoints?: boolean
    pointSetting?: string | null
    loyaltyCalculationMethod?: string | null
    loyaltyCardNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerCreateOrConnectWithoutLoyaltyPointsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutLoyaltyPointsInput, CustomerUncheckedCreateWithoutLoyaltyPointsInput>
  }

  export type LoyaltyPointSettingCreateWithoutLoyaltyPointsInput = {
    id?: string
    description: string
    amount?: number
    equivalentPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPointSettingUncheckedCreateWithoutLoyaltyPointsInput = {
    id?: string
    description: string
    amount?: number
    equivalentPoint?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPointSettingCreateOrConnectWithoutLoyaltyPointsInput = {
    where: LoyaltyPointSettingWhereUniqueInput
    create: XOR<LoyaltyPointSettingCreateWithoutLoyaltyPointsInput, LoyaltyPointSettingUncheckedCreateWithoutLoyaltyPointsInput>
  }

  export type CustomerUpsertWithoutLoyaltyPointsInput = {
    update: XOR<CustomerUpdateWithoutLoyaltyPointsInput, CustomerUncheckedUpdateWithoutLoyaltyPointsInput>
    create: XOR<CustomerCreateWithoutLoyaltyPointsInput, CustomerUncheckedCreateWithoutLoyaltyPointsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutLoyaltyPointsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutLoyaltyPointsInput, CustomerUncheckedUpdateWithoutLoyaltyPointsInput>
  }

  export type CustomerUpdateWithoutLoyaltyPointsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    contactFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phonePrimary?: NullableStringFieldUpdateOperationsInput | string | null
    phoneAlternative?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    creditLimit?: NullableFloatFieldUpdateOperationsInput | number | null
    isTaxExempt?: BoolFieldUpdateOperationsInput | boolean
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsValue?: NullableStringFieldUpdateOperationsInput | string | null
    salesperson?: NullableStringFieldUpdateOperationsInput | string | null
    customerGroup?: NullableStringFieldUpdateOperationsInput | string | null
    isEntitledToLoyaltyPoints?: BoolFieldUpdateOperationsInput | boolean
    pointSetting?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCalculationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateWithoutLoyaltyPointsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    customerName?: StringFieldUpdateOperationsInput | string
    contactFirstName?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phonePrimary?: NullableStringFieldUpdateOperationsInput | string | null
    phoneAlternative?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    creditLimit?: NullableFloatFieldUpdateOperationsInput | number | null
    isTaxExempt?: BoolFieldUpdateOperationsInput | boolean
    paymentTerms?: NullableStringFieldUpdateOperationsInput | string | null
    paymentTermsValue?: NullableStringFieldUpdateOperationsInput | string | null
    salesperson?: NullableStringFieldUpdateOperationsInput | string | null
    customerGroup?: NullableStringFieldUpdateOperationsInput | string | null
    isEntitledToLoyaltyPoints?: BoolFieldUpdateOperationsInput | boolean
    pointSetting?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCalculationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    loyaltyCardNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointSettingUpsertWithoutLoyaltyPointsInput = {
    update: XOR<LoyaltyPointSettingUpdateWithoutLoyaltyPointsInput, LoyaltyPointSettingUncheckedUpdateWithoutLoyaltyPointsInput>
    create: XOR<LoyaltyPointSettingCreateWithoutLoyaltyPointsInput, LoyaltyPointSettingUncheckedCreateWithoutLoyaltyPointsInput>
    where?: LoyaltyPointSettingWhereInput
  }

  export type LoyaltyPointSettingUpdateToOneWithWhereWithoutLoyaltyPointsInput = {
    where?: LoyaltyPointSettingWhereInput
    data: XOR<LoyaltyPointSettingUpdateWithoutLoyaltyPointsInput, LoyaltyPointSettingUncheckedUpdateWithoutLoyaltyPointsInput>
  }

  export type LoyaltyPointSettingUpdateWithoutLoyaltyPointsInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    equivalentPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointSettingUncheckedUpdateWithoutLoyaltyPointsInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    equivalentPoint?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointCreateManyPointSettingInput = {
    id?: string
    customerId: string
    loyaltyCardId: string
    totalPoints?: number
    expiryDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPointUpdateWithoutPointSettingInput = {
    id?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutLoyaltyPointsNestedInput
  }

  export type LoyaltyPointUncheckedUpdateWithoutPointSettingInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointUncheckedUpdateManyWithoutPointSettingInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointCreateManyCustomerInput = {
    id?: string
    loyaltyCardId: string
    totalPoints?: number
    pointSettingId: string
    expiryDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPointUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pointSetting?: LoyaltyPointSettingUpdateOneRequiredWithoutLoyaltyPointsNestedInput
  }

  export type LoyaltyPointUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    pointSettingId?: StringFieldUpdateOperationsInput | string
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPointUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    loyaltyCardId?: StringFieldUpdateOperationsInput | string
    totalPoints?: FloatFieldUpdateOperationsInput | number
    pointSettingId?: StringFieldUpdateOperationsInput | string
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}