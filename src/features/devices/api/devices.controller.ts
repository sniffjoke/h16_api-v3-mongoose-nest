import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { DevicesService } from '../application/devices.service';
import { Request } from 'express';


@Controller('security')
export class DevicesController {

  constructor(
    private readonly devicesService: DevicesService
  ) {
  }

  @Get('devices')
  async getDevices(@Req() req: Request) {
    const devices = await this.devicesService.getDevices(req.cookies  )
    return devices
  }

  @Delete(':id')
  async deleteSessionById(@Req() req: Request, @Param('id') id: string) {
    const deleteDevice = await this.devicesService.deleteDeviceByDeviceIdField(req.cookies, id)
    return deleteDevice
  }

  @Delete('devices')
  async deleteAllMyDevicesExceptCurrent(@Req() req: Request) {
    const deleteDevices = await this.devicesService.deleteAllDevicesExceptCurrent(req.cookies)
    return deleteDevices
  }



}
