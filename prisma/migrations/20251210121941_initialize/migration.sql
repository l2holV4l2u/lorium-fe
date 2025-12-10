-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "title" TEXT,
    "name" TEXT,
    "profileUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "regist" TIMESTAMP(3) NOT NULL,
    "profileURL" TEXT,
    "price" INTEGER NOT NULL,
    "stripeAccountId" TEXT,
    "resultUrl" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizerAssign" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "OrganizerAssign_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormField" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "fieldOrder" INTEGER NOT NULL,
    "choices" TEXT[],
    "description" TEXT,
    "header" TEXT NOT NULL,
    "placeholder" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,

    CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Res" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentIntent" TEXT,
    "paymentStatus" TEXT NOT NULL,
    "paymentId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Res_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResField" (
    "id" TEXT NOT NULL,
    "formFieldId" TEXT NOT NULL,
    "resId" TEXT NOT NULL,
    "textField" TEXT,
    "choiceField" INTEGER[],
    "fileField" TEXT,
    "dateField" TIMESTAMP(3),
    "selectField" INTEGER,

    CONSTRAINT "ResField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketConfig" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "infoLabel" TEXT NOT NULL,
    "venueLabel" TEXT NOT NULL,
    "infoFields" JSONB[],
    "venueFields" JSONB[],

    CONSTRAINT "TicketConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueType" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isUnit" BOOLEAN NOT NULL DEFAULT false,
    "subUnitLabel" TEXT,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "VenueType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "parentId" TEXT,
    "capacity" INTEGER,

    CONSTRAINT "VenueNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueAssign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "subUnitIndex" INTEGER,
    "venueNodeId" TEXT NOT NULL,

    CONSTRAINT "VenueAssign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultColumn" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "fileMap" TEXT,

    CONSTRAINT "ResultColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resultColumnId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ResultData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Event_startDate_endDate_idx" ON "Event"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Form_eventId_key" ON "Form"("eventId");

-- CreateIndex
CREATE INDEX "Form_eventId_idx" ON "Form"("eventId");

-- CreateIndex
CREATE INDEX "FormField_formId_fieldOrder_idx" ON "FormField"("formId", "fieldOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Res_paymentIntent_key" ON "Res"("paymentIntent");

-- CreateIndex
CREATE UNIQUE INDEX "Res_paymentId_key" ON "Res"("paymentId");

-- CreateIndex
CREATE INDEX "Res_paymentStatus_idx" ON "Res"("paymentStatus");

-- CreateIndex
CREATE INDEX "Res_submittedAt_idx" ON "Res"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Res_userId_eventId_key" ON "Res"("userId", "eventId");

-- CreateIndex
CREATE INDEX "ResField_formFieldId_idx" ON "ResField"("formFieldId");

-- CreateIndex
CREATE INDEX "ResField_resId_idx" ON "ResField"("resId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketConfig_eventId_key" ON "TicketConfig"("eventId");

-- CreateIndex
CREATE INDEX "TicketConfig_eventId_idx" ON "TicketConfig"("eventId");

-- CreateIndex
CREATE INDEX "VenueType_eventId_idx" ON "VenueType"("eventId");

-- CreateIndex
CREATE INDEX "VenueNode_eventId_typeId_idx" ON "VenueNode"("eventId", "typeId");

-- CreateIndex
CREATE INDEX "VenueAssign_eventId_idx" ON "VenueAssign"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueAssign_userId_eventId_key" ON "VenueAssign"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueAssign_venueNodeId_subUnitIndex_key" ON "VenueAssign"("venueNodeId", "subUnitIndex");

-- CreateIndex
CREATE INDEX "ResultColumn_eventId_idx" ON "ResultColumn"("eventId");

-- CreateIndex
CREATE INDEX "ResultData_userId_idx" ON "ResultData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResultData_userId_resultColumnId_key" ON "ResultData"("userId", "resultColumnId");

-- AddForeignKey
ALTER TABLE "OrganizerAssign" ADD CONSTRAINT "OrganizerAssign_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizerAssign" ADD CONSTRAINT "OrganizerAssign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Res" ADD CONSTRAINT "Res_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Res" ADD CONSTRAINT "Res_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Res" ADD CONSTRAINT "Res_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResField" ADD CONSTRAINT "ResField_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "FormField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResField" ADD CONSTRAINT "ResField_resId_fkey" FOREIGN KEY ("resId") REFERENCES "Res"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketConfig" ADD CONSTRAINT "TicketConfig_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueType" ADD CONSTRAINT "VenueType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueNode" ADD CONSTRAINT "VenueNode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueNode" ADD CONSTRAINT "VenueNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "VenueNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueNode" ADD CONSTRAINT "VenueNode_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "VenueType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueAssign" ADD CONSTRAINT "VenueAssign_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueAssign" ADD CONSTRAINT "VenueAssign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueAssign" ADD CONSTRAINT "VenueAssign_venueNodeId_fkey" FOREIGN KEY ("venueNodeId") REFERENCES "VenueNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultColumn" ADD CONSTRAINT "ResultColumn_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultData" ADD CONSTRAINT "ResultData_resultColumnId_fkey" FOREIGN KEY ("resultColumnId") REFERENCES "ResultColumn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultData" ADD CONSTRAINT "ResultData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
