package com.prasad.ecomBackend.controller;

import com.prasad.ecomBackend.model.Product;
import com.prasad.ecomBackend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {
    @Autowired
    ProductService service;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(){
        return new ResponseEntity<>(service.getAllProducts(), HttpStatus.OK);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable int id){
        Product product = service.getProduct(id);
        if(product != null) {
            return new ResponseEntity<>(service.getProduct(id), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile){
        try{
            Product product1 = service.addProduct(product, imageFile);
            return new ResponseEntity<>(product1, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImgByProductId(@PathVariable int productId){
        Product product = service.getProduct(productId);

        byte[] imageFile = product.getImageData();
        return new ResponseEntity<>(imageFile, HttpStatus.OK);

    }

    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id, @RequestPart Product product, @RequestPart MultipartFile imageFile){
        Product product1 = null;
        try{
            product1 = service.updateProduct(id, product, imageFile);
        }
        catch(Exception e){
            System.out.println(e.getMessage());
        }
        if(product1 != null)
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        else
            return new ResponseEntity<>("failed to update", HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id){
        Product product = service.getProduct(id);
        if(product != null) {
            service.deleteProduct(id);
            return new ResponseEntity<>("Product deleted Successfully", HttpStatus.OK);
        }
        else
            return new ResponseEntity<>("Can't delete product", HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword){
        List<Product> products = service.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
