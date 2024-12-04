import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { SuccessResponse } from '../../common/dto/success-response.dto';
import { UpdateResult } from 'typeorm';

jest.mock('./document.service');

describe('DocumentController', () => {
  let documentController: DocumentController;
  let documentService: DocumentService;

  beforeEach(async () => {
    const mockDocumentService = {
      addDocument: jest.fn(),
      deleteDocument: jest.fn(),
      getAllDocuments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [{ provide: DocumentService, useValue: mockDocumentService }],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  describe('addDocument', () => {
    it('should add a document and return success response', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
      };
      const payload = { documentName: 'Test Doc', user: 'user-id' };
      const mockResponse: any = { id: 'doc-id', ...payload };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}

      jest
        .spyOn(documentService, 'addDocument')
        .mockResolvedValue(mockResponse);

      const result = await documentController.addDocument(payload, mockFile, mockUser);
      expect(result).toEqual(new SuccessResponse(mockResponse));
      expect(documentService.addDocument).toHaveBeenCalledWith(
        mockFile,
        payload,
      );
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document and return success response', async () => {
      const docId = 'doc-id';

      const mockUpdateResult: UpdateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}

      jest
        .spyOn(documentService, 'deleteDocument')
        .mockResolvedValue(mockUpdateResult);

      const result = await documentController.deleteDocument(docId, mockUser);
      expect(result).toEqual(
        new SuccessResponse('Document deleted successfully!'),
      );
      expect(documentService.deleteDocument).toHaveBeenCalledWith(docId);
    });
  });

  describe('getAllDocument', () => {
    it('should retrieve all documents and return success response', async () => {
      const mockQuery = { filter: {}, pagination: {}, sort: {} };
      const mockResponse: any = { items: [], meta: {} };
      const mockUser = { id: "1", firstName: "jane", lastName: "deo", role: {}}

      jest
        .spyOn(documentService, 'getAllDocuments')
        .mockResolvedValue(mockResponse);

      const result = await documentController.getAllDocument(mockQuery, mockUser);
      expect(result).toEqual(new SuccessResponse(mockResponse));
      expect(documentService.getAllDocuments).toHaveBeenCalledWith(mockQuery);
    });
  });
});

describe('DocumentService', () => {
  let documentService: DocumentService;
  let mockRepo: any;
  let mockS3Service: any;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      }),
    };
    mockS3Service = { uploadFile: jest.fn() };

    documentService = new DocumentService(mockRepo, mockS3Service);
  });

  describe('addDocument', () => {
    it('should save a document and upload file to S3', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
      }; // Fix
      const payload = { documentName: 'Test Doc', user: 'user-id' };
      const mockKey = `user-document/${payload.user}/${Date.now()}.jpg`;

      jest.spyOn(mockS3Service, 'uploadFile').mockResolvedValue(undefined); // Ensure mock resolves
      jest
        .spyOn(mockRepo, 'save')
        .mockResolvedValue({ id: 'doc-id', ...payload });

      const result = await documentService.addDocument(mockFile, payload);

      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(
        mockFile,
        expect.stringContaining(payload.user),
      );
      expect(mockRepo.save).toHaveBeenCalledWith({
        key: expect.any(String),
        ...payload,
      });
      expect(result).toEqual({ id: 'doc-id', ...payload });
    });
  });

  describe('deleteDocument', () => {
    it('should update the isDeleted field to true', async () => {
      const docId = 'doc-id';

      jest.spyOn(mockRepo, 'update').mockResolvedValue({ affected: 1 });

      const result = await documentService.deleteDocument(docId);

      expect(mockRepo.update).toHaveBeenCalledWith(
        { id: docId },
        { isDeleted: true },
      );
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('getAllDocuments', () => {
    it('should retrieve paginated documents based on filters', async () => {
      const mockQuery: any = { filter: {}, pagination: {}, sort: {} };
      const mockResponse = { items: [], meta: {} };

      const result = await documentService.getAllDocuments(mockQuery);

      expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('documents');
      expect(result).toEqual(mockResponse);
    });
  });
});
