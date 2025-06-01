package com.examportal.server.Service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface GoogleDriveService {
    String uploadFile(MultipartFile file) throws IOException;
}
