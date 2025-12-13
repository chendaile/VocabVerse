import { Module } from '@nestjs/common';
import { REVIEW_STRATEGY } from './constants';
import { SimpleReviewStrategy } from './simple-review-strategy';

@Module({
    providers: [
        {
            provide: REVIEW_STRATEGY,
            useClass: SimpleReviewStrategy,
        },
    ],
    exports: [REVIEW_STRATEGY],
})
export class ReviewStrategyModule {}
