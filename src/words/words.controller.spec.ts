import { Test, TestingModule } from '@nestjs/testing';
import { wordsController } from './words.controller';

describe('wordsController', () => {
  let controller: wordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [wordsController],
    }).compile();

    controller = module.get<wordsController>(wordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
