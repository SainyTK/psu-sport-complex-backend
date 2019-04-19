import {
    Injectable,
    MulterOptionsFactory,
    MulterModuleOptions,
} from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        const newName = this.randomString();
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, `${__dirname}/../../uploads/`)
                },
                filename: (req, file, cb) => {
                    cb(null, newName + '-' + Date.now() + '.jpg')
                },

                limits: { fileSize: 10 * 1024 * 1024 }
            })
        };
    }
    randomString() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

export default MulterConfigService;