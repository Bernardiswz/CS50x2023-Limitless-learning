function initializePage() {
    FlashcardsModule.initFlashcards();
    CreateFlashcardsModule.initCreateFlashcards();
    InfoBoxModule.initInfoBox();
    EditFlashcardsModule.initEditFlashcard();
    DeleteFlashcardsModule.initDeleteFlashcards();
}

$(document).ready(initializePage);