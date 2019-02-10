import {
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';

export class parseIntPipe implements PipeTransform<string, number> {
    transform(value: string, metadata: ArgumentMetadata): number {
        const val = parseInt(value);
        if (isNaN(val)) {
            throw new BadRequestException('Validation failed');
        }
        return val;
    }
}