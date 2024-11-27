# Dynostore

Dynostore is a minimal no magic query builder for dynamodb, it's a simple layer on top of the native dynamodb AWS V3 SDK
API.

```ts
// QueryItems

await store.query<CustomerInvoiceItem>()
  .pk(eq('id', 'customer-1'))
  .sk(beginsWith('sk', 'invoice-'))
  .exec()
```

```ts
// GetItem

await store.get<CustomerItem>()
  .key({ id: customer.id })
  .exec()
```

```ts
// UpdateItem

await store
  .update()
  .key({ id: customer.id })
  .update(set('firstName', 'john'), set('lastName', 'doe'), increment('version', 1))
  .condition(notExists('id'), or(), eq('name', 'john'))
  .exec()
```

```ts
// PutItem

await store.put<CustomerItem>()
  .item({ id: 'customer-1', name: 'declan' })
  .exec()
```

```ts
// DeleteItem

await store
  .delete()
  .key({ id: 'customer-1' })
  .exec()
```

```ts
// ScanItems

await store.scan<any>()
  .filter(eq('name', 'john'))
  .exec()
```

See  [Documentation](https://declanprice.github.io/dynostore/) for more in depth usage.

 

