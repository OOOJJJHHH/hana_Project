package com.example.oneproject.DTO;

import java.util.List;

public class LodDTO {
        private Long id;
        private String lodName;
        private String lodCity;
        private String lodImag;  // 프리사인드 URL
        private String lodLocation;
        private String lodOwner;
        private String lodCallNum;


        public LodDTO(Long id, String lodName, String lodCity, String lodImag, String lodLocation,
                         String lodOwner, String lodCallNum) {
            this.id = id;
            this.lodName = lodName;
            this.lodCity = lodCity;
            this.lodImag = lodImag;
            this.lodLocation = lodLocation;
            this.lodOwner = lodOwner;
            this.lodCallNum = lodCallNum;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getLodName() {
            return lodName;
        }

        public void setLodName(String lodName) {
            this.lodName = lodName;
        }

        public String getLodCity() {
            return lodCity;
        }

        public void setLodCity(String lodCity) {
            this.lodCity = lodCity;
        }

        public String getLodImag() {
            return lodImag;
        }

        public void setLodImag(String lodImag) {
            this.lodImag = lodImag;
        }

        public String getLodLocation() {
            return lodLocation;
        }

        public void setLodLocation(String lodLocation) {
            this.lodLocation = lodLocation;
        }

        public String getLodOwner() {
            return lodOwner;
        }

        public void setLodOwner(String lodOwner) {
            this.lodOwner = lodOwner;
        }

        public String getLodCallNum() {
            return lodCallNum;
        }

        public void setLodCallNum(String lodCallNum) {
            this.lodCallNum = lodCallNum;
        }

    }