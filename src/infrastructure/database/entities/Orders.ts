import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity("orders")
export class OrderEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  id: string;

  @Column()
  customerId: string;

  @Column()
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;

  @Column()
  totalAmount: number;

  @Column()
  createdAt: Date;
}
