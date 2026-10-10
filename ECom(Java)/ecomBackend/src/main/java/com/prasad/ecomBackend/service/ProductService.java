package com.prasad.ecomBackend.service;

import com.prasad.ecomBackend.model.Product;
import com.prasad.ecomBackend.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    ProductRepo repo;

    public List<Product> getAllProducts(){
        return repo.findAll();
    }

    public Product getProduct(int id){
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(imageFile.getBytes());
        return repo.save(product);
    }


    public Product updateProduct(int id, Product product, MultipartFile imageFile)
            throws IOException {

        // 1. Fetch the existing product using its ID
        Product existingProduct = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id));

        // 2. Update the existing product's fields
        existingProduct.setName(product.getName());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setReleaseDate(product.getReleaseDate());
        existingProduct.setAvailable(product.isAvailable());

        // 3. Replace the image only if a new image was uploaded
        if (imageFile != null && !imageFile.isEmpty()) {
            existingProduct.setImageData(imageFile.getBytes());
            existingProduct.setImageType(imageFile.getContentType());
            existingProduct.setImageName(imageFile.getOriginalFilename());
        }

        // 4. Save the existing entity, preserving its ID
        return repo.save(existingProduct);
    }


    public void deleteProduct(int id){
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}
