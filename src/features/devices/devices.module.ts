import { Module } from "@nestjs/common";
import { DevicesService } from "./application/devices.service";
import { MongooseModule } from "@nestjs/mongoose";
import { DeviceEntity, DeviceSchema } from './domain/devices.entity';
import { DevicesController } from './api/devices.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{
        name: DeviceEntity.name,
        schema: DeviceSchema,
    }]),
  ],
  controllers: [DevicesController],
  providers: [
    DevicesService
  ],
  exports: [
    DevicesService,
  ]
})
export class DevicesModule {}
