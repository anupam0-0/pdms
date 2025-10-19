# API Routes

## Base URL
```
http://localhost:5000/api
```

## Authentication Routes (`/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | User login |
| POST | `/logout` | ✅ | User logout |
| GET | `/me` | ✅ | Get current user profile |

## Product Routes (`/products`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all medications |
| GET | `/search` | ❌ | Search medications |
| GET | `/:id` | ❌ | Get medication by ID |
| POST | `/` | ✅ | Create medication (seller/admin) |
| PUT | `/:id` | ✅ | Update medication (seller/admin) |
| DELETE | `/:id` | ✅ | Delete medication (seller/admin) |

## Inventory Routes (`/inventory`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | Get all inventory |
| GET | `/low-stock` | ✅ | Get low stock items |
| GET | `/:id` | ✅ | Get inventory by ID |
| POST | `/` | ✅ | Create inventory record |
| PUT | `/:id` | ✅ | Update inventory |
| DELETE | `/:id` | ✅ | Delete inventory |

## Order Routes (`/orders`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | Get all orders |
| GET | `/:id` | ✅ | Get order by ID |
| POST | `/` | ✅ | Create prescription order |
| PUT | `/:id/status` | ✅ | Update order status (admin) |
| PUT | `/:id/cancel` | ✅ | Cancel order |

## Featured Items Routes (`/featured`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Get all featured items |
| GET | `/active` | ❌ | Get active featured items |
| GET | `/:id` | ❌ | Get featured item by ID |
| POST | `/` | ✅ | Create featured item (admin) |
| PUT | `/:id` | ✅ | Update featured item (admin) |
| DELETE | `/:id` | ✅ | Delete featured item (admin) |
| DELETE | `/cleanup/expired` | ✅ | Cleanup expired items (admin) |

## Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

## Error Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "ErrorCode"
}
```

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```
