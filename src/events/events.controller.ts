import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PQEventsService } from './events.service';
import { Event } from './entities/event.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class PQEventController {
  constructor(private readonly pqEventsService: PQEventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PQ event' })
  @ApiResponse({ status: 201, description: 'Event created', type: Event })
  async create(@Body() createPQEventDto: Event) {
    try {
      return await this.pqEventsService.create(createPQEventDto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to create event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all PQ events' })
  @ApiResponse({ status: 200, description: 'Array of events', type: [Event] })
  async findAll() {
    try {
      return await this.pqEventsService.findAll();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to fetch events',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PQ event by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Event object', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.pqEventsService.findOne(+id);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to fetch event by ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a PQ event' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Event updated', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePQEventDto: Partial<Event>,
  ) {
    try {
      return await this.pqEventsService.update(+id, updatePQEventDto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to update event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PQ event' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 204, description: 'Event deleted' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async remove(@Param('id') id: string) {
    try {
      return await this.pqEventsService.remove(+id);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to delete event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId/date')
  @ApiOperation({ summary: 'Get events by user ID and date' })
  @ApiQuery({ name: 'userId', type: 'number' })
  @ApiQuery({ name: 'date', type: 'string' })
  @ApiResponse({ status: 200, description: 'Array of events', type: [Event] })
  async getEventsByUserAndDate(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('date') dateString: string,
  ): Promise<Event[]> {
    try {
      const date = new Date(dateString);
      return await this.pqEventsService.findEventsByUserAndDate(userId, date);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to fetch events by user ID and date',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
