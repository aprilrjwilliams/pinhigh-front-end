export class Timeslot {
  public constructor(
    public id: string,
    public date: string,
    public startTime: string,
    public user_id: string,
    public bay: string
  ) {}
}
