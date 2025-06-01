package com.examportal.server.Service;

import com.google.api.client.http.InputStreamContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;

@Service
public class GoogleDriveServiceImpl implements GoogleDriveService {
    private static final String APPLICATION_NAME = "MySpringBootApp";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Value("${google.credentials.path}")
    private String credentialsPath;

    private Drive getDriveService() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                new ClassPathResource(credentialsPath).getInputStream())
                .createScoped(Collections.singletonList("https://www.googleapis.com/auth/drive.file"));

        return new Drive.Builder(
                new NetHttpTransport(), 
                JSON_FACTORY, 
                new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        Drive driveService = getDriveService();

        // Tạo metadata cho file
        File fileMetadata = new File();
        fileMetadata.setName(file.getOriginalFilename());

        // Tạo InputStreamContent từ MultipartFile
        InputStreamContent mediaContent = new InputStreamContent(
                file.getContentType(), file.getInputStream());

        // Upload file lên Google Drive
        File uploadedFile = driveService.files()
                .create(fileMetadata, mediaContent)
                .setFields("id, webViewLink")
                .execute();
        setFilePublic(uploadedFile.getId(), driveService);

        // 5. Trả về link Google Drive (public)
        return uploadedFile.getWebViewLink();
    }

    private void setFilePublic(String fileId, Drive driveService) throws IOException {
        Permission permission = new Permission();
        permission.setType("anyone"); // Bất kỳ ai cũng có thể truy cập
        permission.setRole("reader"); // Chỉ được xem, không chỉnh sửa

        driveService.permissions().create(fileId, permission).execute();
    }
}