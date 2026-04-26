-- UpdateData
UPDATE "JobOffer" 
SET "createdAt" = CURRENT_TIMESTAMP 
WHERE "createdAt" IS NULL;
