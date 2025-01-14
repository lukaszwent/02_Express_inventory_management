import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity("products")
export class ProductEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
