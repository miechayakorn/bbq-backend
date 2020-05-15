[![pipeline status](https://gitlab.com/miechayakorn/BBQ-backend/badges/1.0/pipeline.svg)](https://gitlab.com/miechayakorn/BBQ-backend/-/commits/1.0)
## Adonis
### --- ขั้นตอนการสร้าง table ใน DB
1. สร้าง table ใน local
```
adonis make:migration [ชื่อตาราง]
```
> จะสร้างไฟล์ /database/migrations/[ชื่อตาราง]

2. เข้าไปสร้าง column ใน method 
```
table.string('title', 10).notNullable().unique()
```
> [Column Types/Modifiers](https://adonisjs.com/docs/4.1/migrations#_column_typesmodifiers)
3. สร้าง table และ column ลงใน DB
```
adonis migration:run
```
### --- คำสั่งจำเป็น
รันโหมด Dev
```
adonis serve --dev
```
### สร้าง
- model
```
adonis make:model .....
```
- controller
```
adonis make:controller .....
```
### Migration

```
adonis migration:status
```
```
adonis migration:run
```
```
adonis migration:rollback
```
### Run docker-compose

- `docker-compose up -d` or `./start.sh`


