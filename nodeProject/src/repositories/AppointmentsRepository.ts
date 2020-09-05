import { EntityRepository, Repository } from 'typeorm'

import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date, provider_id: string): Promise<Appointment | null> {
    const findAppointment = await this.findOne({
      where: {
        date,
        provider_id,
      }
    });

    return findAppointment || null;
  }

}

export default AppointmentsRepository;
