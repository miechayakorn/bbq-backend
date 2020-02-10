bbq-backend
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
--- 
```
adonis make:model .....
```
```
adonis make:controller .....
```
