import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { EventType } from "../enums/EventType";
//ovo nece biti u mikroservisu samo privremeno dok prvi servis ne kreira strukturu
@Entity("event")
export class Event{
    @PrimaryGeneratedColumn()
    event_id!:number;

    @Column({type:"varchar",length:255})
    event_source!:string;

    @Column({type:"enum",enum:EventType,default:EventType.INFO})
    event_type!:EventType;

    @Column({type:"varchar",length:255})
    event_description!:string;

    @Column({type:"timestamp"})
    timestamp!:Date;


}