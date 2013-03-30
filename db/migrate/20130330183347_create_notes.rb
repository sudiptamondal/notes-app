class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.text :note_text_why
      t.integer :user_id
      t.text :note_text_what
      t.integer :task_priority

      t.timestamps
    end
  end
end
