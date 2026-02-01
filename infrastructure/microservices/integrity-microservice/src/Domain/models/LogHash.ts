import { Entity, ObjectIdColumn, Column, Index } from "typeorm";

@Entity("log_integrity_chain")
export class LogHash {
    @ObjectIdColumn()
    _id!: string;

    @Column()
    @Index({ unique: true })
    eventId!: string; // ID originalnog loga iz drugog servisa

    @Column()
    previousHash!: string; // Hash prethodnog zapisa

    @Column()
    currentHash!: string; // Hash (podaci + previousHash)

    @Column({ default: false })
    isCompromised!: boolean; // Flag ako je integritet narušen

    @Column({ type: "timestamp" })
    timestamp!: Date;
}